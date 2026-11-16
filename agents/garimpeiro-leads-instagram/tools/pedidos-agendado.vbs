' Agendador do Windows (tarefa "Garimpo - pedidos do painel", a cada 15 min): confere os pedidos de garimpo
' feitos pelo botão do painel, sem abrir janela. Log em ..\rodadas\pedidos-agendado.log.
Set sh = CreateObject("WScript.Shell")
pasta = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)
sh.CurrentDirectory = pasta
sh.Run "cmd /c """"C:\Program Files\nodejs\node.exe"" """ & pasta & "\pedidos.mjs"" proximo >> """ & pasta & "\..\rodadas\pedidos-agendado.log"" 2>&1""", 0, False
