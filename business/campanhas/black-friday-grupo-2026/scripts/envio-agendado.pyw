"""Roda o enviar-convite-whatsapp.py escondido (sem janela), pro Agendador de Tarefas do Windows.

Usado no dia 14 durante a live: nenhuma janela pode aparecer na tela compartilhada da Karol.
Saída vai pro log do vault: business/vault/black-expert-2026/envios-agendados.log
Uso (pelo agendar-whatsapp-live.ps1): pythonw envio-agendado.pyw --mensagem live_cade_voce --enviar --confirmo BLACK-EXPERT
"""
import datetime
import os
import runpy
import subprocess
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
VAULT = os.path.abspath(os.path.join(AQUI, "..", "..", "..", "vault", "black-expert-2026"))

_run = subprocess.run


def _run_sem_janela(*a, **k):
    k.setdefault("creationflags", subprocess.CREATE_NO_WINDOW)
    return _run(*a, **k)


subprocess.run = _run_sem_janela  # o op.exe (1Password) também não abre janela

log = open(os.path.join(VAULT, "envios-agendados.log"), "a", encoding="utf-8", buffering=1)
sys.stdout = sys.stderr = log
print("=== %s %s" % (datetime.datetime.now().isoformat(timespec="seconds"), " ".join(sys.argv[1:])))
sys.argv = ["enviar-convite-whatsapp.py"] + sys.argv[1:]
try:
    runpy.run_path(os.path.join(AQUI, "enviar-convite-whatsapp.py"), run_name="__main__")
except SystemExit as e:
    print("saiu:", e)
except Exception as e:  # registra e encerra, sem janela de erro
    print("ERRO:", repr(e))
