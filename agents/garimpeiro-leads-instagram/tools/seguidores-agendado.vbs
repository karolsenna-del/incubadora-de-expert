' Agendador do Windows (tarefa "Garimpo - seguidores diario", 1x por dia): garimpa ~50 seguidores da Karol,
' dentro do crédito grátis do Apify, e manda os aprovados pra fila do painel. Log em ..\rodadas\seguidores-diario.log.
Set sh = CreateObject("WScript.Shell")
pasta = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)
sh.CurrentDirectory = pasta
sh.Run "cmd /c """"C:\Program Files\nodejs\node.exe"" """ & pasta & "\seguidores-diario.mjs"" >> """ & pasta & "\..\rodadas\seguidores-agendado.log"" 2>&1""", 0, False
