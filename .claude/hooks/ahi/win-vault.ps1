# win-vault.ps1 - cofre local do Auroq OS no Windows (captura AHI).
#
# Faz so isto, no computador do proprio aluno, e nada mais:
#   protect     deixa as pastas recebidas privadas: so o dono da conta do Windows e o SISTEMA
#               acessam, sem heranca de permissao de fora.
#   create-key  gera uma chave aleatoria de 32 bytes e a protege com o DPAPI do Windows
#               (escopo do usuario atual: so este usuario, neste computador, consegue abrir).
#   open-key    abre com o DPAPI uma chave que o create-key protegeu antes.
#
# Nao acessa a rede, nao baixa nem executa codigo de fora, nao inicia outros programas e nao grava
# arquivo nenhum: so troca a permissao das pastas recebidas (protect) ou escreve o resultado na
# saida padrao. Quem chama e o security.cjs, desta mesma pasta, por -File, passando a acao como
# argumento. Os dados entram por stdin em UTF-8 (uma pasta por linha em protect; a chave protegida
# em hex em open-key) e a resposta sai por stdout: "ok N" em protect (N pastas protegidas) e a chave
# em hex nas outras duas. Qualquer erro, ou resposta fora desse formato, e tratado pelo security.cjs
# como cofre indisponivel (falha fechada).
#
# Usa so a API do .NET, sem cmdlets: preparar os modulos do PowerShell numa maquina fria passava
# do limite de 5 segundos do security.cjs.
param([string]$Action)

$ErrorActionPreference = 'Stop'
$PSModuleAutoLoadingPreference = 'None'

# stdin em bytes crus, lidos como UTF-8: o console do Windows usa outra codificacao (OEM) e
# estragaria o acento no nome da pasta do aluno.
function Get-StdinText {
  $stream = [Console]::OpenStandardInput()
  $buffer = [IO.MemoryStream]::new()
  try { $stream.CopyTo($buffer) } finally { $stream.Dispose() }
  return [Text.UTF8Encoding]::new($false).GetString($buffer.ToArray())
}

function ConvertTo-Hex([byte[]]$Bytes) {
  return [BitConverter]::ToString($Bytes).Replace('-', '').ToLowerInvariant()
}

function ConvertFrom-Hex([string]$Hex) {
  if ($Hex.Length -eq 0 -or ($Hex.Length % 2) -ne 0) { throw 'hex invalido' }
  $bytes = [byte[]]::new([int]($Hex.Length / 2))
  for ($i = 0; $i -lt $bytes.Length; $i++) { $bytes[$i] = [Convert]::ToByte($Hex.Substring(2 * $i, 2), 16) }
  return , $bytes
}

function Protect-Folders([string]$Text) {
  $owner = [Security.Principal.WindowsIdentity]::GetCurrent().User
  $system = [Security.Principal.SecurityIdentifier]::new('S-1-5-18')
  $count = 0
  foreach ($line in $Text.Split([char[]]@([char]10), [StringSplitOptions]::RemoveEmptyEntries)) {
    $folder = $line.TrimEnd([char]13)
    if ($folder.Length -eq 0) { continue }
    # Caminho relativo seria resolvido a partir da pasta do hook, nao da pasta do aluno.
    if (-not [IO.Path]::IsPathRooted($folder)) { throw 'caminho nao absoluto' }
    $acl = [Security.AccessControl.DirectorySecurity]::new()
    $acl.SetOwner($owner)
    $acl.SetAccessRuleProtection($true, $false)
    foreach ($who in @($owner, $system)) {
      $rule = [Security.AccessControl.FileSystemAccessRule]::new($who, [Security.AccessControl.FileSystemRights]::FullControl, [Security.AccessControl.InheritanceFlags]'ContainerInherit,ObjectInherit', [Security.AccessControl.PropagationFlags]::None, [Security.AccessControl.AccessControlType]::Allow)
      [void]$acl.AddAccessRule($rule)
    }
    [void][IO.Directory]::SetAccessControl($folder, $acl)
    $count++
  }
  if ($count -eq 0) { throw 'nenhuma pasta recebida' }
  [Console]::Write("ok $count")
}

function Import-DpapiAssembly {
  [void][Reflection.Assembly]::Load('System.Security, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a')
}

function New-ProtectedKey {
  Import-DpapiAssembly
  $key = [byte[]]::new(32)
  $random = [Security.Cryptography.RandomNumberGenerator]::Create()
  try {
    $random.GetBytes($key)
    $wrapped = [Security.Cryptography.ProtectedData]::Protect($key, $null, [Security.Cryptography.DataProtectionScope]::CurrentUser)
    [Console]::Write((ConvertTo-Hex $wrapped))
  } finally {
    $random.Dispose()
    [Array]::Clear($key, 0, $key.Length)
  }
}

function Open-ProtectedKey([string]$Text) {
  Import-DpapiAssembly
  $wrapped = ConvertFrom-Hex $Text.Trim()
  $key = [Security.Cryptography.ProtectedData]::Unprotect($wrapped, $null, [Security.Cryptography.DataProtectionScope]::CurrentUser)
  try {
    [Console]::Write((ConvertTo-Hex $key))
  } finally {
    [Array]::Clear($key, 0, $key.Length)
  }
}

switch ($Action) {
  'protect' { Protect-Folders (Get-StdinText) }
  'create-key' { New-ProtectedKey }
  'open-key' { Open-ProtectedKey (Get-StdinText) }
  default { throw 'acao desconhecida' }
}
