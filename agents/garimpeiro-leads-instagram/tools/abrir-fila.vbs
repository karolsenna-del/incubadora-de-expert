' Abre a Fila de abordagem sem janela preta. Chamado pelo botão da Central da Incubadora
' (endereço fila-garimpo://abrir, registrado no Windows da Karol em 11/11/2026).
Set sh = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
pasta = fso.GetParentFolderName(WScript.ScriptFullName)
sh.CurrentDirectory = pasta
sh.Run """C:\Program Files\nodejs\node.exe"" """ & pasta & "\fila-abordagem.mjs""", 0, False
