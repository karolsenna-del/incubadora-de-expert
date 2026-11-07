import sys, datetime
from copy import copy
import openpyxl
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.chart import LineChart, BarChart3D, AreaChart, Reference
from openpyxl.chart.shapes import GraphicalProperties
from openpyxl.formatting.rule import FormulaRule, DataBarRule
from openpyxl.worksheet.hyperlink import Hyperlink

OUT = sys.argv[1]
RASTREADOR_M3 = sys.argv[2]          # modelo do Rastreador (M3.5) já com as 4 colunas novas
TESTE = len(sys.argv) > 3            # gera linhas de teste no Rastreador

PRETO = "1A1A1A"; LARANJA = "F05A28"; INPUT = "FDE3D8"; CINZA = "EDEDED"; BRANCO = "FFFFFF"
MOEDA = '"R$" #,##0.00'; MOEDA0 = '"R$" #,##0'; PCT = '0%'; PCT1 = '0.0%'; NUM = '0'; NUM2 = '0.0'; MES_FMT = 'mmm/yy'; DATA = 'dd/mm/yyyy'
thin = Side(style="thin", color="D9D9D9"); BORDA = Border(left=thin, right=thin, top=thin, bottom=thin)
FUNIS = ["Vendas Secretas", "Lives Secretas", "Mini-treinamento", "VSL", "Venda por mensagem"]
MES = [get_column_letter(4 + i) for i in range(12)]   # D..O = mês 1..12
E = "'1. Estratégico'!"; T = "'2. Tático'!"; O = "'3. Operacional'!"; RA = "'Rastreador de Leads'!"
L1, LN = 4, 1004                                         # linhas do Rastreador


def rg(col):
    return f"{RA}${col}${L1}:${col}${LN}"


def titulo(ws, txt, sub=None):
    ws["A1"] = txt; ws["A1"].font = Font(bold=True, size=16, color=LARANJA)
    if sub:
        ws["A2"] = sub; ws["A2"].font = Font(italic=True, size=10, color="595959")


def head(ws, row, cols, start=1):
    for i, t in enumerate(cols):
        c = ws.cell(row=row, column=start + i, value=t)
        c.font = Font(bold=True, color=BRANCO); c.fill = PatternFill("solid", fgColor=PRETO)
        c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True); c.border = BORDA


def head_meses(ws, row, primeiro, extra=None):
    """Cabeçalho com os 12 meses em D..O (puxados do Estratégico)."""
    for i, L in enumerate(MES):
        c = ws[f"{L}{row}"]
        c.value = f"={E}{L}$8" if primeiro is None else primeiro(i)
        c.number_format = MES_FMT
        c.font = Font(bold=True, color=BRANCO); c.fill = PatternFill("solid", fgColor=PRETO)
        c.alignment = Alignment(horizontal="center"); c.border = BORDA
    for j, t in enumerate(extra or []):
        c = ws.cell(row=row, column=16 + j, value=t)
        c.font = Font(bold=True, color=BRANCO); c.fill = PatternFill("solid", fgColor=PRETO)
        c.alignment = Alignment(horizontal="center", wrap_text=True); c.border = BORDA


def faixa(ws, row, txt, ncols):
    c = ws.cell(row=row, column=1, value=txt)
    c.font = Font(bold=True, color=BRANCO); c.fill = PatternFill("solid", fgColor=LARANJA)
    ws.merge_cells(start_row=row, start_column=1, end_row=row, end_column=ncols)


def cel(ws, ref, val=None, fmt=None, inp=False, bold=False, fill=None):
    c = ws[ref]
    if val is not None: c.value = val
    if fmt: c.number_format = fmt
    c.border = BORDA
    if inp: c.fill = PatternFill("solid", fgColor=INPUT)
    elif fill: c.fill = PatternFill("solid", fgColor=fill)
    if bold: c.font = Font(bold=True)
    return c


def nota(ws, row, txt, col=1):
    ws.cell(row=row, column=col, value=txt).font = Font(italic=True, color="595959")


def larguras(ws, ws_w):
    for i, w in enumerate(ws_w, 1): ws.column_dimensions[get_column_letter(i)].width = w


def larg_meses(ws, a=40, b=24, c=10, m=11, extra=(14,)):
    larguras(ws, [a, b, c] + [m] * 12 + list(extra))


wb = Workbook()

# ================= COMO USAR =================
cu = wb.active; cu.title = "Como usar"
titulo(cu, "EXPERT PLAN — o plano de escala do seu negócio",
       "Da meta de faturamento até a rotina comercial da sua semana, mês a mês")
linhas = [
    ("NAVEGUE PELAS ABAS — clique pra ir direto (em toda aba tem o menu no topo)", None),
    ("→ Painel do mês: quanto falta da meta do mês e quanto por semana", "LINK:Painel do mês"),
    ("→ Rastreador de Leads: onde você registra tudo o que faz", "LINK:Rastreador de Leads"),
    ("→ 1. Estratégico: a meta e os produtos", "LINK:1. Estratégico"),
    ("→ 2. Tático: de qual funil vem cada venda", "LINK:2. Tático"),
    ("→ 3. Operacional: a conta de trás pra frente", "LINK:3. Operacional"),
    ("→ 4. Rotina semanal: o que vai pra sua agenda", "LINK:4. Rotina semanal"),
    ("→ 5. Acompanhamento: planejado x realizado, mês a mês", "LINK:5. Acompanhamento"),
    ("", None),
    ("PRA QUE SERVE", None),
    ("O Expert Plan transforma a sua meta de faturamento numa conta simples: quantas vendas, de quais produtos, vindas de quais funis — e quantas abordagens, sessões, lives, follow-ups e conversas você precisa fazer por semana pra chegar lá.", None),
    ("O plano é mês a mês: o seu negócio muda ao longo do ano (produto novo, funil novo, mais tempo pra uma rotina), e cada mês tem os seus números.", None),
    ("", None),
    ("REGRA DAS CORES", None),
    ("Célula laranja-claro = você preenche. Todo o resto a planilha calcula sozinha — não precisa mexer.", "INPUT"),
    ("Os números que já vêm preenchidos são um EXEMPLO pra você ver a conta funcionando. Troque pelos seus.", None),
    ("", None),
    ("UM LUGAR SÓ PRA REGISTRAR: O RASTREADOR DE LEADS", None),
    ("Você não digita o que fez em lugar nenhum além da aba Rastreador de Leads. Abordou, fez sessão, vendeu: registra lá, com a data. O Acompanhamento e o Painel do mês se atualizam sozinhos.", None),
    ("As 4 colunas que fazem a conta: Funil de origem · Data da abordagem · Data da sessão (preencha depois que a sessão aconteceu) · Produto vendido. Com Fechou? = Sim, Valor e Data Fechamento, a venda entra no mês certo.", None),
    ("Digite as datas completas (dd/mm/aaaa). Data escrita de outro jeito a planilha não reconhece e não conta.", None),
    ("Vem do Rastreador do Módulo 3? Selecione as suas linhas preenchidas (colunas A até S) e cole na aba Rastreador de Leads, a partir da linha 4. As 4 colunas novas ficam logo depois (T até W). Faça isso uma vez e passe a usar só esta planilha.", None),
    ("O seu histórico: as vendas antigas entram no mês certo, porque já têm Data Fechamento. Abordagens e sessões antigas não têm data, então a contagem delas começa quando você passa a preencher as colunas novas. Se quiser, complete as datas das linhas antigas que você lembrar.", None),
    ("", None),
    ("PASSO A PASSO (no começo do plano)", None),
    ("1. Aba 1. Estratégico — coloque o ano do plano, a meta de faturamento do ano e os seus produtos: nome, preço, tipo (Ao vivo = vendido numa sessão de venda e entregue ao vivo, como mentoria; Por mensagem = vendido direto no WhatsApp ou no direct, sem sessão, como uma sessão avulsa; Gravado = curso gravado ou low ticket) e quantas vendas de cada um você planeja em cada mês. Produto que ainda não existe fica com zero até o mês em que entra. O plano vai sempre de janeiro a dezembro: se você começa no meio do ano, deixe os meses anteriores com zero.", None),
    ("2. Aba 2. Tático — escolha o estágio de funis de cada mês (de 1 a 5). A planilha distribui as vendas entre os funis ativos naquele mês.", None),
    ("3. Aba 3. Operacional — a conta de trás pra frente: quantas abordagens, sessões, convites, leads e conversas cada funil pede em cada mês.", None),
    ("4. Aba 4. Rotina semanal — a semana-padrão de cada mês. É ela que vai pra sua agenda. Coloque quantas sessões de venda você consegue fazer por semana: a planilha avisa o mês em que o plano passa disso.", None),
    ("5. Aba Rastreador de Leads — o seu dia a dia. Tudo que você faz é registrado aqui.", None),
    ("6. Aba 5. Acompanhamento e aba Painel do mês — calculam sozinhas o planejado x realizado, com gráfico.", None),
    ("", None),
    ("TODO FIM DE MÊS — o ritual de replanejar", None),
    ("1. Abra o Acompanhamento: o que ficou acima e o que ficou abaixo do planejado? As suas taxas reais estão acima do pior cenário?", None),
    ("2. Replaneje SÓ os meses que ainda não começaram: vendas por produto (entrou produto novo?), estágio de funis, lives por mês, sessões que cabem na agenda.", None),
    ("3. Nunca mude um mês que já passou: ele é o seu histórico. É a comparação com ele que mostra se você está evoluindo.", None),
    ("4. Leve a Rotina semanal do mês novo pra sua agenda, como compromisso fixo.", None),
    ("", None),
    ("OS 5 ESTÁGIOS — os funis entram um de cada vez", None),
    ("Estágio 1 — só Vendas Secretas. É o primeiro funil, o que valida o método e o que mais converte.", None),
    ("Estágio 2 — + Lives Secretas. Estágio 3 — + Mini-treinamento. Estágio 4 — + Venda por mensagem.", None),
    ("Produto do tipo Por mensagem é a exceção: ele é vendido na conversa desde o estágio 1, então as vendas dele vão sempre pro funil Venda por mensagem e não ocupam a sua agenda de sessões.", None),
    ("Estágio 5 — + VSL, só quando você tiver produto gravado (curso ou low ticket).", None),
    ("Não comece pelo produto gravado: ele só entra depois que o seu método já vende no 1:1 — por isso fica no último estágio.", None),
    ("A cada estágio, as Vendas Secretas pesam menos: lives e mini-treinamento também levam pra sessão, então você faz menos abordagens e ganha tempo pros outros funis.", None),
    ("Não pule estágio: só avance quando o funil novo estiver rodando toda semana.", None),
    ("", None),
    ("AS TAXAS — sempre o pior cenário", None),
    ("A conta usa taxas de PIOR CENÁRIO, pessimistas de propósito. Se o plano fecha com elas, na vida real você tende a passar da meta.", None),
    ("No Acompanhamento você vê as suas taxas reais ao lado das pessimistas: quando as suas estão acima, você está superando o plano.", None),
    ("O fechamento conta quem fecha na sessão E quem fecha depois, no follow-up. Produto acima de R$ 1.000 quase nunca fecha na hora: o follow-up está na sua rotina de propósito.", None),
    ("O comparecimento de 80% vale quando VOCÊ aborda e faz a sessão. Com equipe comercial abordando e fazendo a sessão, o comparecimento costuma cair.", None),
    ("", None),
    ("OS 5 FUNIS", None),
    ("Vendas Secretas — você aborda pessoas que já conhece, convida pra uma sessão e vende no 1:1.", None),
    ("Lives Secretas — lives fechadas num grupo de pessoas convidadas; depois da live, quem se interessa pede uma sessão.", None),
    ("Mini-treinamento — página de captura entrega um treinamento curto; quem gosta chama no WhatsApp e agenda uma sessão.", None),
    ("Venda por mensagem — a pessoa levanta a mão (comenta, responde um story, manda direct) e a venda acontece na conversa, sem sessão.", None),
    ("VSL — página com vídeo de vendas e botão de compra direta (curso gravado ou low ticket).", None),
]
r = 4
for txt, tipo in linhas:
    c = cu.cell(row=r, column=1, value=txt)
    c.alignment = Alignment(wrap_text=True, vertical="top")
    if txt and txt.split(" — ")[0].split(" (")[0].replace(":", "").isupper():
        c.font = Font(bold=True, color=BRANCO); c.fill = PatternFill("solid", fgColor=PRETO)
    if tipo == "INPUT": c.fill = PatternFill("solid", fgColor=INPUT)
    if tipo and tipo.startswith("LINK:"):
        c.hyperlink = Hyperlink(ref=c.coordinate, location=f"'{tipo[5:]}'!A1", display=txt)
        c.font = Font(bold=True, color=LARANJA, underline="single", size=12)
        cu.row_dimensions[r].height = 20
    r += 1
cu.column_dimensions["A"].width = 120

# ================= 1. ESTRATÉGICO =================
es = wb.create_sheet("1. Estratégico")
titulo(es, "1. ESTRATÉGICO — a meta", "Quanto você quer faturar no ano (janeiro a dezembro), com quais produtos, mês a mês")
cel(es, "A4", "Meta de faturamento do ano", bold=True); cel(es, "B4", 100000, MOEDA, inp=True)
cel(es, "A5", "Meta por mês (média)", bold=True); cel(es, "B5", "=B4/12", MOEDA)
cel(es, "A6", "Ano do plano", bold=True); cel(es, "B6", 2027, NUM, inp=True)
nota(es, 6, "← o plano vai de janeiro a dezembro deste ano. No ano seguinte, faça uma cópia da planilha e troque o ano.", col=3)
c = es["D7"]; c.value = "VENDAS PLANEJADAS EM CADA MÊS"; c.font = Font(bold=True, color=BRANCO); c.fill = PatternFill("solid", fgColor=LARANJA)
es.merge_cells("D7:O7"); c.alignment = Alignment(horizontal="center")
head(es, 8, ["Produto", "Preço", "Tipo"])
head_meses(es, 8, lambda i: f"=DATE($B$6,{i + 1},1)",
           ["Vendas no ano", "Faturamento no ano", "% da meta"])
exemplo = [
    ("Mentoria completa (exemplo)", 5000, "Ao vivo", [0] + [1] * 11),
    ("Mentoria VIP · 3 encontros (exemplo)", 1500, "Ao vivo", [1, 1, 1] + [2] * 9),
    ("Mentoria Destrava · 1 sessão (exemplo)", 300, "Por mensagem", [4] * 12),
    (None, None, None, None), (None, None, None, None),
]
dv = DataValidation(type="list", formula1='"Ao vivo,Por mensagem,Gravado"', allow_blank=True); es.add_data_validation(dv)
for i, (n, p, t, v) in enumerate(exemplo):
    rr = 9 + i
    cel(es, f"A{rr}", n, inp=True); cel(es, f"B{rr}", p, MOEDA, inp=True)
    cel(es, f"C{rr}", t, inp=True); dv.add(f"C{rr}")
    for j, L in enumerate(MES):
        cel(es, f"{L}{rr}", v[j] if v else None, NUM2, inp=True)
    cel(es, f"P{rr}", f"=SUM(D{rr}:O{rr})", NUM2)
    cel(es, f"Q{rr}", f"=B{rr}*P{rr}", MOEDA)
    cel(es, f"R{rr}", f"=IFERROR(Q{rr}/$B$4,0)", PCT)
cel(es, "A14", "TOTAL DE VENDAS", bold=True, fill=CINZA)
for L in MES + ["P"]:
    cel(es, f"{L}14", f"=SUM({L}9:{L}13)", NUM2, bold=True, fill=CINZA)
cel(es, "Q14", "=SUM(Q9:Q13)", MOEDA, bold=True, fill=CINZA); cel(es, "R14", "=IFERROR(Q14/$B$4,0)", PCT, bold=True, fill=CINZA)
cel(es, "A15", "Faturamento planejado no mês", bold=True)
cel(es, "A16", "Faturamento acumulado", bold=True)
cel(es, "A17", "Meta acumulada", bold=True)
cel(es, "A18", "Situação", bold=True)
for i, L in enumerate(MES):
    cel(es, f"{L}15", f"=SUMPRODUCT($B$9:$B$13,{L}9:{L}13)", MOEDA0, bold=True)
    cel(es, f"{L}16", f"=SUM($D$15:{L}15)", MOEDA0)
    cel(es, f"{L}17", f"=$B$5*{i + 1}", MOEDA0)
    cel(es, f"{L}18", f'=IF({L}16>={L}17,"No ritmo","Abaixo")')
cel(es, "A20", "Faturamento planejado no ano", bold=True); cel(es, "B20", "=Q14", MOEDA)
cel(es, "A21", "Diferença entre o plano e a meta", bold=True); cel(es, "B21", "=Q14-B4", MOEDA)
cel(es, "A22", "Situação", bold=True)
cel(es, "B22", '=IF(B4=0,"Preencha a meta",IF(Q14>=B4,"O plano bate a meta","Ainda falta: aumente vendas, preço ou crie produto"))', bold=True)
cel(es, "A23", "Produtos sem tipo", bold=True)
cel(es, "B23", '=IF(SUMPRODUCT((A9:A13<>"")*(C9:C13=""))>0,"Preencha o tipo de todos os produtos","OK")')
faixa(es, 25, "CONTAS DE APOIO (usadas pelo Tático — não precisa mexer)", 15)
cel(es, "A26", "Vendas no mês — produtos Ao vivo"); cel(es, "A27", "Vendas no mês — produtos Gravados")
cel(es, "A28", "Faturamento no mês — Ao vivo"); cel(es, "A29", "Faturamento no mês — Gravado")
cel(es, "A30", "Vendas no mês — produtos Por mensagem"); cel(es, "A31", "Faturamento no mês — Por mensagem")
for L in MES:
    cel(es, f"{L}26", f'=SUMIF($C$9:$C$13,"Ao vivo",{L}9:{L}13)', NUM2)
    cel(es, f"{L}27", f'=SUMIF($C$9:$C$13,"Gravado",{L}9:{L}13)', NUM2)
    cel(es, f"{L}28", f'=SUMPRODUCT(($C$9:$C$13="Ao vivo")*$B$9:$B$13,{L}9:{L}13)', MOEDA0)
    cel(es, f"{L}29", f'=SUMPRODUCT(($C$9:$C$13="Gravado")*$B$9:$B$13,{L}9:{L}13)', MOEDA0)
    cel(es, f"{L}30", f'=SUMIF($C$9:$C$13,"Por mensagem",{L}9:{L}13)', NUM2)
    cel(es, f"{L}31", f'=SUMPRODUCT(($C$9:$C$13="Por mensagem")*$B$9:$B$13,{L}9:{L}13)', MOEDA0)
larg_meses(es, 40, 14, 12, 10, (14, 18, 10))
es.freeze_panes = "D9"

# ================= 2. TÁTICO =================
ta = wb.create_sheet("2. Tático")
titulo(ta, "2. TÁTICO — funil x produto", "Os funis entram um de cada vez. Escolha o estágio de cada mês e a planilha distribui as vendas entre os funis ativos.")
head(ta, 4, ["Mês", "", ""]); head_meses(ta, 4, None)
cel(ta, "A5", "Seu estágio de funis (1 a 5)", bold=True)
cel(ta, "A6", "Aviso", bold=True)
estagio_ex = [1, 1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 4]
dv2 = DataValidation(type="list", formula1='"1,2,3,4,5"', allow_blank=False); ta.add_data_validation(dv2)
for i, L in enumerate(MES):
    cel(ta, f"{L}5", estagio_ex[i], NUM, inp=True); dv2.add(f"{L}5")
    cel(ta, f"{L}6", f'=IF(AND({L}5<5,{E}{L}27>0),"Gravado só no estágio 5","")')

faixa(ta, 8, "PRODUTO AO VIVO (vendido em sessão ou conversa) — de onde vêm as vendas em cada estágio", 8)
head(ta, 9, ["Estágio"] + FUNIS + ["Total", "Situação"])
estagios = [
    ("1 · Vendas Secretas", (1.00, 0, 0, 0, 0)),
    ("2 · + Lives Secretas", (0.60, 0.40, 0, 0, 0)),
    ("3 · + Mini-treinamento", (0.40, 0.35, 0.25, 0, 0)),
    ("4 · + Venda por mensagem", (0.30, 0.30, 0.20, 0, 0.20)),
    ("5 · + VSL (com produto Gravado)", (0.30, 0.30, 0.20, 0, 0.20)),
]
for i, (nome, d) in enumerate(estagios):
    rr = 10 + i
    cel(ta, f"A{rr}", nome, bold=True)
    for j in range(5):
        cel(ta, f"{get_column_letter(2 + j)}{rr}", d[j], PCT, inp=True)
    cel(ta, f"G{rr}", f"=SUM(B{rr}:F{rr})", PCT, bold=True)
    cel(ta, f"H{rr}", f'=IF(ROUND(G{rr},4)=1,"OK","Ajuste até dar 100%")')
faixa(ta, 16, "PRODUTO GRAVADO (curso gravado ou low ticket) — só no estágio 5", 8)
head(ta, 17, [""] + FUNIS + ["Total", "Situação"])
cel(ta, "A18", "Estágio 5", bold=True)
for j, v in enumerate((0, 0, 0, 0.70, 0.30)):
    cel(ta, f"{get_column_letter(2 + j)}18", v, PCT, inp=True)
cel(ta, "G18", "=SUM(B18:F18)", PCT, bold=True); cel(ta, "H18", '=IF(ROUND(G18,4)=1,"OK","Ajuste até dar 100%")')
nota(ta, 19, "Produto Por mensagem (vendido no WhatsApp, sem sessão): as vendas vão todas pro funil Venda por mensagem, em qualquer estágio.")


def por_funil(j, L, linha_avivo, linha_grav, linha_msg):
    D = get_column_letter(2 + j)
    msg = f"+{E}{L}{linha_msg}" if FUNIS[j] == "Venda por mensagem" else ""   # Por mensagem: sempre nesse funil
    return f"=IFERROR(INDEX(${D}$10:${D}$14,{L}$5)*{E}{L}{linha_avivo}+IF({L}$5=5,${D}$18*{E}{L}{linha_grav},0){msg},0)"


faixa(ta, 20, "VENDAS POR FUNIL — mês a mês", 16)
head(ta, 21, ["Funil", "", ""]); head_meses(ta, 21, None, ["No ano"])
for j, f in enumerate(FUNIS):
    rr = 22 + j
    cel(ta, f"A{rr}", f, bold=True)
    for L in MES: cel(ta, f"{L}{rr}", por_funil(j, L, 26, 27, 30), NUM2)
    cel(ta, f"P{rr}", f"=SUM(D{rr}:O{rr})", NUM2, bold=True)
cel(ta, "A27", "Vendas — total", bold=True, fill=CINZA)
for L in MES + ["P"]: cel(ta, f"{L}27", f"=SUM({L}22:{L}26)", NUM2, bold=True, fill=CINZA)
faixa(ta, 29, "FATURAMENTO POR FUNIL — mês a mês", 16)
head(ta, 30, ["Funil", "", ""]); head_meses(ta, 30, None, ["No ano"])
for j, f in enumerate(FUNIS):
    rr = 31 + j
    cel(ta, f"A{rr}", f, bold=True)
    for L in MES: cel(ta, f"{L}{rr}", por_funil(j, L, 28, 29, 31), MOEDA0)
    cel(ta, f"P{rr}", f"=SUM(D{rr}:O{rr})", MOEDA0, bold=True)
cel(ta, "A36", "Faturamento — total", bold=True, fill=CINZA)
for L in MES + ["P"]: cel(ta, f"{L}36", f"=SUM({L}31:{L}35)", MOEDA0, bold=True, fill=CINZA)

faixa(ta, 38, "PRODUTO POR PRODUTO — escolha um mês pra ver de onde vem cada venda", 8)
cel(ta, "A39", "Mês pra ver (1 = janeiro)", bold=True); cel(ta, "B39", 1, NUM, inp=True)
dv3 = DataValidation(type="list", formula1='"1,2,3,4,5,6,7,8,9,10,11,12"'); ta.add_data_validation(dv3); dv3.add("B39")
cel(ta, "C39", "=INDEX($D$4:$O$4,$B$39)", MES_FMT, bold=True)
head(ta, 40, ["Produto"] + FUNIS + ["Total"])
STG = "INDEX($D$5:$O$5,$B$39)"
for i in range(5):
    rr, er = 41 + i, 9 + i
    VEN = f"INDEX({E}$D${er}:$O${er},$B$39)"
    cel(ta, f"A{rr}", f'=IF({E}$A${er}="","",{E}$A${er})', bold=True)
    for j in range(5):
        D = get_column_letter(2 + j)
        cel(ta, f"{D}{rr}", f'=IF({E}$A${er}="","",IFERROR(IF({E}$C${er}="Ao vivo",{VEN}*INDEX({D}$10:{D}$14,{STG}),IF(AND({E}$C${er}="Gravado",{STG}=5),{VEN}*{D}$18,IF({E}$C${er}="Por mensagem",{VEN}*{1 if FUNIS[j] == "Venda por mensagem" else 0},0))),0))', NUM2)
    cel(ta, f"G{rr}", f'=IF(A{rr}="","",SUM(B{rr}:F{rr}))', NUM2, bold=True)
cel(ta, "A46", "Vendas — total", bold=True, fill=CINZA); cel(ta, "A47", "Faturamento", bold=True, fill=CINZA)
for j in range(6):
    D = get_column_letter(2 + j)
    cel(ta, f"{D}46", f"=SUM({D}41:{D}45)", NUM2, bold=True, fill=CINZA)
    cel(ta, f"{D}47", f"=SUMPRODUCT({D}41:{D}45,{E}$B$9:$B$13)", MOEDA, bold=True, fill=CINZA)
nota(ta, 48, "Nos meses com mais de um funil aparecem frações (ex.: 0,3 venda): é a média do mês, porque as vendas de cada produto se dividem entre os funis.")
larguras(ta, [36, 16, 16, 17, 12, 19, 14, 12, 11, 11, 11, 11, 11, 11, 11, 12])
ta.freeze_panes = "D5"

# ================= 3. OPERACIONAL =================
op = wb.create_sheet("3. Operacional")
titulo(op, "3. OPERACIONAL — a conta de trás pra frente",
       "Quanto cada funil pede em cada mês, sempre com taxas de PIOR CENÁRIO (pessimistas de propósito).")
cel(op, "A3", "Semanas por mês (pra conta da semana)", bold=True); cel(op, "B3", 4, NUM, inp=True)
REF = {}
r = 5


def bloco(nome, desc, j, etapas):
    global r
    faixa(op, r, f"{nome.upper()} — {desc}", 15)
    r += 1
    head(op, r, ["Por mês", "O que a taxa mede", "Taxa"]); head_meses(op, r, None)
    r += 1
    cel(op, f"A{r}", "Vendas", bold=True); cel(op, f"B{r}", "—", fill=CINZA); cel(op, f"C{r}", None, fill=CINZA)
    for L in MES: cel(op, f"{L}{r}", f"={T}{L}{22 + j}", NUM2, bold=True)
    REF[(nome, "Vendas")] = r
    prev = r
    for qtd, mede, taxa in etapas:
        r += 1
        cel(op, f"A{r}", qtd); cel(op, f"B{r}", mede); cel(op, f"C{r}", taxa, PCT1, fill=CINZA)
        for L in MES: cel(op, f"{L}{r}", f"=IFERROR(ROUNDUP({L}{prev}/$C{r},0),0)", NUM, bold=True)
        REF[(nome, qtd)] = r
        prev = r
    r += 2


FECHA = "fecha (na sessão ou no follow-up)"
bloco("Vendas Secretas", "abordagem de quem você conhece", 0, [
    ("Sessões realizadas", FECHA, 0.25),
    ("Sessões agendadas", "comparece na sessão", 0.80),
    ("Conversas (responderam)", "aceita a sessão", 0.30),
    ("Abordagens", "responde a abordagem", 0.50),
])
bloco("Lives Secretas", "lives fechadas no grupo", 1, [
    ("Sessões realizadas", FECHA, 0.25),
    ("Sessões agendadas", "comparece na sessão", 0.80),
    ("Pessoas que assistiram às lives", "pede sessão depois da live", 0.15),
    ("Pessoas novas no grupo", "assiste à live", 0.40),
    ("Convites", "entra no grupo", 0.20),
])
r -= 1
cel(op, f"A{r}", "Lives Secretas no mês", bold=True)
for L in MES: cel(op, f"{L}{r}", 4, NUM, inp=True)
REF[("Lives Secretas", "Lives por mês")] = r
r += 1
cel(op, f"A{r}", "Pessoas assistindo por live (média)", bold=True)
for L in MES:
    cel(op, f"{L}{r}", f"=IFERROR(ROUNDUP({L}{REF[('Lives Secretas', 'Pessoas que assistiram às lives')]}/{L}{r - 1},0),0)", NUM)
r += 3
bloco("Mini-treinamento", "página de captura → WhatsApp → sessão", 2, [
    ("Sessões realizadas", FECHA, 0.25),
    ("Sessões agendadas", "comparece na sessão", 0.80),
    ("Leads (cadastros)", "agenda sessão pelo WhatsApp", 0.03),
    ("Visitantes da página", "vira lead na página", 0.30),
])
bloco("Venda por mensagem", "levantada de mão → conversa → venda", 4, [
    ("Conversas de verdade", "fecha na conversa", 0.05),
    ("Levantadas de mão", "vira conversa de verdade", 0.50),
])
bloco("VSL", "página com vídeo e compra direta", 3, [
    ("Visitantes da página", "compra na página", 0.005),
])
larg_meses(op, 36, 30, 8, 10, ())
op.freeze_panes = "D5"


def F(nome, qtd, L):
    return f"{O}{L}{REF[(nome, qtd)]}"


SESS = ["Vendas Secretas", "Lives Secretas", "Mini-treinamento"]

# ================= 4. ROTINA SEMANAL =================
ro = wb.create_sheet("4. Rotina semanal")
titulo(ro, "4. ROTINA SEMANAL — o que vai pra sua agenda", "A semana-padrão de cada mês. Na virada do mês, leve a coluna do mês novo pra agenda.")
head(ro, 4, ["Atividade (por semana)", "Funil", ""]); head_meses(ro, 4, None)
SEM = f"{O}$B$3"
itens = [
    ("Abordar pessoas que você conhece", "Vendas Secretas", ("Vendas Secretas", "Abordagens")),
    ("Fazer Lives Secretas", "Lives Secretas", "LIVES"),
    ("Convidar pessoas pro grupo das lives", "Lives Secretas", ("Lives Secretas", "Convites")),
    ("Levar visitantes à página do mini-treinamento", "Mini-treinamento", ("Mini-treinamento", "Visitantes da página")),
    ("Gerar levantadas de mão (conteúdo com chamada pra conversa)", "Venda por mensagem", ("Venda por mensagem", "Levantadas de mão")),
    ("Conduzir conversas de venda por mensagem", "Venda por mensagem", ("Venda por mensagem", "Conversas de verdade")),
    ("Levar visitantes à página da VSL", "VSL", ("VSL", "Visitantes da página")),
]
rr = 5
for a, f, ref in itens:
    cel(ro, f"A{rr}", a); cel(ro, f"B{rr}", f)
    for L in MES:
        if ref == "LIVES":
            cel(ro, f"{L}{rr}", f"=IF({T}{L}23=0,0,{F('Lives Secretas', 'Lives por mês', L)}/{SEM})", NUM2, bold=True)
        else:
            cel(ro, f"{L}{rr}", f"=ROUNDUP({F(ref[0], ref[1], L)}/{SEM},0)", NUM, bold=True)
    rr += 1
linha_sess = rr
cel(ro, f"A{rr}", "Fazer sessões de venda (todas as agendadas)", bold=True, fill=CINZA); cel(ro, f"B{rr}", "Secretas, Lives e Mini", fill=CINZA)
for L in MES:
    cel(ro, f"{L}{rr}", "=ROUNDUP((" + "+".join(F(n, "Sessões agendadas", L) for n in SESS) + f")/{SEM},0)", NUM, bold=True, fill=CINZA)
rr += 1
cel(ro, f"A{rr}", "Fazer follow-up de quem não fechou na sessão", bold=True, fill=CINZA); cel(ro, f"B{rr}", "Secretas, Lives e Mini", fill=CINZA)
for L in MES:
    re_ = "+".join(F(n, "Sessões realizadas", L) for n in SESS); vd = "+".join(F(n, "Vendas", L) for n in SESS)
    cel(ro, f"{L}{rr}", f"=MAX(0,ROUNDUP(({re_}-({vd}))/{SEM},0))", NUM, bold=True, fill=CINZA)
rr += 2
cel(ro, f"A{rr}", "Quantas sessões de venda você consegue fazer por semana?", bold=True)
cap = rr
for L in MES: cel(ro, f"{L}{rr}", 6, NUM, inp=True)
rr += 1
cel(ro, f"A{rr}", "Situação da agenda", bold=True)
for L in MES:
    cel(ro, f"{L}{rr}", f'=IF({L}{linha_sess}<={L}{cap},"Cabe","Passou")', bold=True)
nota(ro, rr, "Passou = volte um estágio ou ajuste a distribuição naquele mês", col=2)
rr += 2
cel(ro, f"A{rr}", "Abordagens por dia útil (5 por semana)", bold=True)
for L in MES: cel(ro, f"{L}{rr}", f"=IF({L}5=0,0,ROUNDUP({L}5/5,0))", NUM)
rr += 1
cel(ro, f"A{rr}", "Vendas esperadas por semana", bold=True)
for L in MES: cel(ro, f"{L}{rr}", f"={T}{L}27/{SEM}", NUM2, bold=True)
rr += 1
cel(ro, f"A{rr}", "Faturamento esperado por semana", bold=True)
for L in MES: cel(ro, f"{L}{rr}", f"={T}{L}36/{SEM}", MOEDA0, bold=True)
rr += 2
nota(ro, rr, "Follow-up é onde mais se perde venda: produto acima de R$ 1.000 quase nunca fecha na hora. Quem fecha no follow-up conta como venda da sessão.")
nota(ro, rr + 1, "Dica: bloqueie esses horários na agenda como compromisso fixo. Rotina comercial é o que dá previsibilidade — não a inspiração do dia.")
larg_meses(ro, 58, 22, 2, 10, ())
ro.freeze_panes = "D5"


def arruma(ch):
    ch.x_axis.delete = False; ch.y_axis.delete = False
    ch.legend.position = "r"; ch.y_axis.title = None
    ch.y_axis.majorGridlines.spPr = GraphicalProperties(); ch.y_axis.majorGridlines.spPr.line.solidFill = "EDEDED"
    for s in ch.series:
        s.smooth = False
    ch.series[1].marker.symbol = "circle"; ch.series[1].marker.size = 6
    ch.series[1].marker.graphicalProperties.solidFill = LARANJA; ch.series[1].marker.graphicalProperties.line.solidFill = LARANJA

# ================= 5. ACOMPANHAMENTO =================
ac = wb.create_sheet("5. Acompanhamento")
titulo(ac, "5. ACOMPANHAMENTO — planejado x realizado", "Calcula sozinho: o planejado vem do plano de cada mês e o realizado vem do Rastreador de Leads. Você não digita nada aqui.")
grupos = [("Mês", 1, 1), ("Abordagens", 2, 3), ("Sessões realizadas", 4, 5), ("Vendas", 6, 7), ("Faturamento", 8, 9),
          ("% do faturamento planejado", 10, 10), ("Faturamento acumulado", 11, 12)]
for nome, c1, c2 in grupos:
    ac.cell(row=4, column=c1, value=nome)
    if c2 > c1: ac.merge_cells(start_row=4, start_column=c1, end_row=4, end_column=c2)
    for cc in range(c1, c2 + 1):
        x = ac.cell(row=4, column=cc); x.font = Font(bold=True, color=BRANCO); x.fill = PatternFill("solid", fgColor=PRETO)
        x.alignment = Alignment(horizontal="center", wrap_text=True); x.border = BORDA
sub = ["", "Planejado", "Realizado", "Planejado", "Realizado", "Planejado", "Realizado", "Planejado", "Realizado", "", "Planejado", "Realizado"]
for i, s in enumerate(sub, 1):
    x = ac.cell(row=5, column=i, value=s); x.font = Font(bold=True); x.fill = PatternFill("solid", fgColor=CINZA)
    x.alignment = Alignment(horizontal="center"); x.border = BORDA


def no_mes(col, rr):
    return f"({rg(col)}>=$A{rr})*({rg(col)}<DATE(YEAR($A{rr}),MONTH($A{rr})+1,1))"


VS_OU_VAZIO = f"(({rg('T')}=\"Vendas Secretas\")+({rg('T')}=\"\"))"
for m in range(12):
    rr = 6 + m; L = MES[m]
    cel(ac, f"A{rr}", f"={E}{L}8", MES_FMT, bold=True)
    cel(ac, f"B{rr}", f"={F('Vendas Secretas', 'Abordagens', L)}", NUM)
    cel(ac, f"C{rr}", f"=SUMPRODUCT({no_mes('U', rr)}*{VS_OU_VAZIO})", NUM, bold=True)
    cel(ac, f"D{rr}", "=" + "+".join(F(n, "Sessões realizadas", L) for n in SESS), NUM)
    cel(ac, f"E{rr}", f"=SUMPRODUCT({no_mes('V', rr)})", NUM, bold=True)
    cel(ac, f"F{rr}", f"={T}{L}27", NUM2)
    cel(ac, f"G{rr}", f"=SUMPRODUCT(({rg('O')}=\"Sim\")*{no_mes('Q', rr)})", NUM, bold=True)
    cel(ac, f"H{rr}", f"={T}{L}36", MOEDA0)
    cel(ac, f"I{rr}", f"=SUMPRODUCT(({rg('O')}=\"Sim\")*{no_mes('Q', rr)},{rg('P')})", MOEDA0, bold=True)
    cel(ac, f"J{rr}", f"=IFERROR(I{rr}/H{rr},0)", PCT)
    cel(ac, f"K{rr}", f"=SUM($H$6:H{rr})", MOEDA0)
    cel(ac, f"L{rr}", f"=IF($A{rr}>TODAY(),NA(),SUM($I$6:I{rr}))", MOEDA0, bold=True)
cel(ac, "A18", "TOTAL", bold=True, fill=CINZA)
for L in "BCDEFGHI":
    cel(ac, f"{L}18", f"=SUM({L}6:{L}17)", MOEDA0 if L in "HI" else NUM, bold=True, fill=CINZA)
cel(ac, "J18", "=IFERROR(I18/H18,0)", PCT, bold=True, fill=CINZA)
nota(ac, 19, "Faturamento acumulado realizado só aparece até o mês atual. Abordagens contam as de Vendas Secretas (Funil de origem = Vendas Secretas ou em branco).")

r0 = 21
faixa(ac, r0, "SUAS TAXAS REAIS x PIOR CENÁRIO — acima do pior cenário = você está superando o plano", 7)
head(ac, r0 + 1, ["Taxa", "", "Sua taxa real", "Pior cenário", "Situação"])
ac.merge_cells(start_row=r0 + 1, start_column=5, end_row=r0 + 1, end_column=7)
ab_vs = f"SUMPRODUCT(({rg('U')}<>\"\")*{VS_OU_VAZIO})"
se_vs = f"SUMPRODUCT(({rg('U')}<>\"\")*({rg('V')}<>\"\")*{VS_OU_VAZIO})"
se_all = f"SUMPRODUCT(({rg('V')}<>\"\")*1)"
ve_se = f"SUMPRODUCT(({rg('V')}<>\"\")*({rg('O')}=\"Sim\"))"
vs = lambda q: f"{O}$C${REF[('Vendas Secretas', q)]}"
taxas = [
    ("Abordagem vira sessão feita (Vendas Secretas)", f"=IFERROR({se_vs}/{ab_vs},\"\")",
     f"={vs('Abordagens')}*{vs('Conversas (responderam)')}*{vs('Sessões agendadas')}"),
    ("Sessão vira venda (na hora ou no follow-up)", f"=IFERROR({ve_se}/{se_all},\"\")", f"={vs('Sessões realizadas')}"),
]
for i, (n, f1, f2) in enumerate(taxas):
    rr = r0 + 2 + i
    cel(ac, f"A{rr}", n); ac.merge_cells(start_row=rr, start_column=1, end_row=rr, end_column=2)
    cel(ac, f"C{rr}", f1, PCT1, bold=True); cel(ac, f"D{rr}", f2, PCT1)
    cel(ac, f"E{rr}", f'=IF(C{rr}="","",IF(C{rr}>=D{rr},"Acima do pior cenário","Abaixo: reveja esse passo"))')
    ac.merge_cells(start_row=rr, start_column=5, end_row=rr, end_column=7)
nota(ac, r0 + 5, "As taxas usam tudo o que está no Rastreador. As de VSL, mini-treinamento e levantadas de mão você lê direto na plataforma de vendas, na página e nas suas mensagens.")
larguras(ac, [12] + [12] * 11)
ac.freeze_panes = "B6"


def col3d(titulo_, h, w):
    c3 = BarChart3D(); c3.type = "col"; c3.grouping = "clustered"; c3.shape = "box"
    c3.title = titulo_; c3.height = h; c3.width = w; c3.gapWidth = 60; c3.gapDepth = 120
    c3.view3D.rotX = 12; c3.view3D.rotY = 18; c3.view3D.rAngAx = True
    for parede in (c3.floor, c3.sideWall, c3.backWall):
        parede.graphicalProperties = GraphicalProperties(noFill=True); parede.graphicalProperties.line.noFill = True
    c3.x_axis.delete = False; c3.y_axis.delete = False; c3.legend.position = "b"
    c3.y_axis.majorGridlines.spPr = GraphicalProperties(); c3.y_axis.majorGridlines.spPr.line.solidFill = "EDEDED"
    return c3


def cores(chart, *cs):
    for s, cor in zip(chart.series, cs):
        s.graphicalProperties.solidFill = cor; s.graphicalProperties.line.solidFill = cor


c3a = col3d("Faturamento mês a mês — planejado x realizado", 9, 24)
c3a.y_axis.numFmt = '#,##0'
c3a.add_data(Reference(ac, min_col=8, min_row=5, max_row=17), titles_from_data=True)
c3a.add_data(Reference(ac, min_col=9, min_row=5, max_row=17), titles_from_data=True)
c3a.set_categories(Reference(ac, min_col=1, min_row=6, max_row=17))
c3a.x_axis.number_format = MES_FMT
cores(c3a, "BFBFBF", LARANJA); ac.add_chart(c3a, "A29")
ch = LineChart(); ch.title = "Faturamento acumulado — planejado x realizado"; ch.height = 8; ch.width = 24
ch.y_axis.title = "R$"; ch.y_axis.numFmt = '#,##0'
ch.add_data(Reference(ac, min_col=11, min_row=5, max_row=17), titles_from_data=True)
ch.add_data(Reference(ac, min_col=12, min_row=5, max_row=17), titles_from_data=True)
ch.set_categories(Reference(ac, min_col=1, min_row=6, max_row=17))
ch.series[0].graphicalProperties.line.solidFill = "7F7F7F"; ch.series[0].graphicalProperties.line.dashStyle = "dash"
ch.series[1].graphicalProperties.line.solidFill = LARANJA; ch.series[1].graphicalProperties.line.width = 32000
arruma(ch); ch.legend.position = "b"; ac.add_chart(ch, "A48")

# ================= PAINEL DO MÊS =================
pa = wb.create_sheet("Painel do mês", 1)
titulo(pa, "PAINEL DO MÊS — quanto falta e quanto por semana", "Abre sozinho no mês de hoje. Quer ver outro mês? Escolha em \"Ver o mês\". Tudo vem do plano e do Rastreador de Leads.")
NOMES_MES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"]
dp = wb.create_sheet("Dados do painel"); dp.sheet_state = "hidden"   # aba escondida: só alimenta o Painel
PA = "'Painel do mês'!"; DP = "'Dados do painel'!"
titulo(dp, "DADOS DO PAINEL — alimentam os gráficos e o menu do Painel do mês (não precisa mexer)")
faixa(dp, 59, "LISTA DO MENU \"VER O MÊS\"", 3)
for i, n in enumerate(["Mês atual"] + NOMES_MES): dp[f"A{60 + i}"] = n
cel(pa, "A4", "Hoje", bold=True); cel(pa, "B4", "=TODAY()", DATA)
cel(pa, "A5", "Ver o mês  ▼", bold=True); cel(pa, "B5", "Mês atual", inp=True, bold=True)
dvm = DataValidation(type="list", formula1=f"={DP}$A$60:$A$72", allow_blank=False); pa.add_data_validation(dvm); dvm.add("B5")
AUTO = f"IF(YEAR(B4)<{E}$B$6,1,IF(YEAR(B4)>{E}$B$6,12,MONTH(B4)))"
cel(pa, "A6", "Mês", bold=True)
cel(pa, "B6", f'=INDEX({E}$D$8:$O$8,IF(OR(B5="",B5="Mês atual"),{AUTO},MATCH(B5,{DP}$A$61:$A$72,0)))', MES_FMT, bold=True)
cel(pa, "A7", "Dias que faltam no mês (contando hoje)", bold=True)
cel(pa, "B7", "=MAX(0,MIN(DAY(DATE(YEAR(B6),MONTH(B6)+1,0)),DATE(YEAR(B6),MONTH(B6)+1,1)-B4))", NUM)
head(pa, 9, ["", "Meta do mês", "Feito até hoje", "Falta", "% feito", "Falta por semana", "Progresso"])
pa.row_dimensions[9].height = 30
painel = [("Faturamento", "H", "I", MOEDA0), ("Vendas", "F", "G", NUM2), ("Abordagens", "B", "C", NUM), ("Sessões realizadas", "D", "E", NUM)]
for i, (n, cp, cr, fm) in enumerate(painel):
    rr = 10 + i
    pa.row_dimensions[rr].height = 26
    cel(pa, f"A{rr}", n, bold=True)
    cel(pa, f"B{rr}", f"=INDEX('5. Acompanhamento'!${cp}$6:${cp}$17,MONTH($B$6))", fm)
    cel(pa, f"C{rr}", f"=INDEX('5. Acompanhamento'!${cr}$6:${cr}$17,MONTH($B$6))", fm).font = Font(bold=True, size=13)
    cel(pa, f"D{rr}", f"=MAX(0,B{rr}-C{rr})", fm, fill=CINZA).font = Font(bold=True, size=13, color=LARANJA)
    cel(pa, f"E{rr}", f"=IFERROR(C{rr}/B{rr},0)", PCT, bold=True)
    cel(pa, f"F{rr}", f"=IF($B$7=0,D{rr},D{rr}/MAX(1,$B$7/7))", NUM2 if fm != MOEDA0 else MOEDA0, bold=True)
    bar = f"ROUND(MIN(1,MAX(0,E{rr}))*10,0)"
    cel(pa, f"G{rr}", f'=REPT("█",{bar})&REPT("░",10-{bar})').font = Font(color=LARANJA, size=12)
    for col in "ABCDEFG": pa[f"{col}{rr}"].alignment = Alignment(vertical="center", horizontal="left" if col == "A" else "center")
cel(pa, "A15", "Situação", bold=True)
cel(pa, "B15", '=IF(B6>B4,"Mês ainda não começou",IF(C10>=B10,"Meta do mês batida!",IF(B7=0,"Mês encerrado abaixo da meta",IF(C10>=B10*(1-B7/DAY(DATE(YEAR(B6),MONTH(B6)+1,0))),"No ritmo","Abaixo do ritmo: acelere o que falta"))))', bold=True)
pa.merge_cells("B15:G15"); pa["B15"].alignment = Alignment(horizontal="center", vertical="center"); pa.row_dimensions[15].height = 26; pa["A15"].alignment = Alignment(vertical="center")
faixa(dp, 51, "DADOS DO GRÁFICO DE BARRAS", 3)
head(dp, 52, ["Indicador", "Meta", "Feito"])
for i, (n, *_r) in enumerate(painel):
    cel(dp, f"A{53 + i}", n); cel(dp, f"B{53 + i}", 1, PCT); cel(dp, f"C{53 + i}", f"={PA}E{10 + i}", PCT)
faixa(dp, 17, "DADOS DO GRÁFICO (dia a dia do mês)", 3)
head(dp, 18, ["Dia", "Ritmo pra bater a meta", "Realizado acumulado"])
larguras(dp, [14, 22, 22])
for d in range(31):
    rr = 19 + d
    dia = f"{PA}$B$6+{d}"
    cel(dp, f"A{rr}", f'=IF(MONTH({dia})=MONTH({PA}$B$6),{dia},"")', "dd/mm")
    cel(dp, f"B{rr}", f'=IF(A{rr}="",NA(),{PA}$B$10*DAY(A{rr})/DAY(DATE(YEAR({PA}$B$6),MONTH({PA}$B$6)+1,0)))', MOEDA0)
    cel(dp, f"C{rr}", f'=IF(OR(A{rr}="",A{rr}>{PA}$B$4),NA(),SUMPRODUCT(({rg("O")}="Sim")*({rg("Q")}>={PA}$B$6)*({rg("Q")}<=A{rr}),{rg("P")}))', MOEDA0)
larguras(pa, [36, 16, 18, 16, 10, 16, 18])
c3p = col3d("Quanto da meta do mês você já fez", 8, 18)
c3p.y_axis.numFmt = '0%'; c3p.y_axis.scaling.min = 0
c3p.add_data(Reference(dp, min_col=2, min_row=52, max_row=56), titles_from_data=True)
c3p.add_data(Reference(dp, min_col=3, min_row=52, max_row=56), titles_from_data=True)
c3p.set_categories(Reference(dp, min_col=1, min_row=53, max_row=56))
cores(c3p, "D9D9D9", LARANJA); pa.add_chart(c3p, "I4")
# dia a dia: meta em área cinza + realizado em linha laranja
ch2 = AreaChart(); ch2.title = "Faturamento do mês — ritmo pra bater a meta x realizado"; ch2.height = 9; ch2.width = 25
ch2.y_axis.numFmt = '#,##0'
ch2.add_data(Reference(dp, min_col=2, min_row=18, max_row=49), titles_from_data=True)
ch2.set_categories(Reference(dp, min_col=1, min_row=19, max_row=49))
ch2.series[0].graphicalProperties.solidFill = "EDEDED"; ch2.series[0].graphicalProperties.line.solidFill = "BFBFBF"
ln = LineChart()
ln.add_data(Reference(dp, min_col=3, min_row=18, max_row=49), titles_from_data=True)
ln.series[0].graphicalProperties.line.solidFill = LARANJA; ln.series[0].graphicalProperties.line.width = 38000; ln.series[0].smooth = False
ln.series[0].marker.symbol = "circle"; ln.series[0].marker.size = 5
ln.series[0].marker.graphicalProperties = GraphicalProperties(solidFill=LARANJA); ln.series[0].marker.graphicalProperties.line.solidFill = LARANJA
ch2.x_axis.number_format = "dd/mm"; ch2.x_axis.delete = False; ch2.y_axis.delete = False; ch2.legend.position = "b"
ch2.y_axis.majorGridlines.spPr = GraphicalProperties(); ch2.y_axis.majorGridlines.spPr.line.solidFill = "EDEDED"
ch2 += ln
pa.add_chart(ch2, "A17")

# ================= RASTREADOR DE LEADS (cópia do M3.5 + as 4 colunas do plano) =================
src = openpyxl.load_workbook(RASTREADOR_M3).worksheets[0]
ra = wb.create_sheet("Rastreador de Leads", 2)
NCOL = 23
for row in src.iter_rows(min_row=1, max_row=5, max_col=NCOL):
    for c in row:
        d = ra.cell(row=c.row, column=c.column, value=c.value)
        if c.has_style:
            d.font = copy(c.font); d.fill = copy(c.fill); d.border = copy(c.border)
            d.alignment = copy(c.alignment); d.number_format = c.number_format
NOVAS = ["Funil de origem", "Data da abordagem", "Data da sessão", "Produto vendido"]
for i, n in enumerate(NOVAS):          # as 4 colunas do plano (T..W), no estilo da coluna S
    for rr in range(3, 6):
        s = ra.cell(row=rr, column=19); d = ra.cell(row=rr, column=20 + i)
        d.font = copy(s.font); d.fill = copy(s.fill); d.border = copy(s.border); d.alignment = copy(s.alignment)
    ra.cell(row=3, column=20 + i, value=n)
ra["T4"] = "Vendas Secretas"
dvf = DataValidation(type="list", formula1='"Vendas Secretas,Lives Secretas,Mini-treinamento,Venda por mensagem,VSL"', allow_blank=True)
ra.add_data_validation(dvf); dvf.add(f"T5:T{LN}")
ra["A2"] = (src["A2"].value or "").replace("Status, Fechou? e Depoimento", "Status, Fechou?, Depoimento, Funil de origem e Produto vendido")
for rr in range(6, LN + 1):            # repete o estilo da linha 5 até o fim
    for cc in range(1, NCOL + 1):
        s = ra.cell(row=5, column=cc); d = ra.cell(row=rr, column=cc)
        d.border = copy(s.border); d.number_format = s.number_format; d.alignment = copy(s.alignment); d.font = copy(s.font)
        if cc == 8: d.value = f'=COUNTIF(D{rr}:G{rr},"Sim")'
for k, v in src.column_dimensions.items():
    ra.column_dimensions[k].width = v.width
for k, w in {"T": 20, "U": 14, "V": 14, "W": 30}.items(): ra.column_dimensions[k].width = w
for rh in src.row_dimensions: ra.row_dimensions[rh].height = src.row_dimensions[rh].height
ra.merge_cells("A1:C1"); ra.merge_cells(f"A2:{get_column_letter(NCOL)}2")
ra.freeze_panes = src.freeze_panes
for dvs in src.data_validations.dataValidation:
    novo = DataValidation(type=dvs.type, formula1=dvs.formula1, allow_blank=True)
    ra.add_data_validation(novo)
    for rng in str(dvs.sqref).split():
        a, b = rng.split(":"); col1 = "".join(ch_ for ch_ in a if ch_.isalpha()); col2 = "".join(ch_ for ch_ in b if ch_.isalpha())
        novo.add(f"{col1}5:{col2}{LN}")
for cf in src.conditional_formatting:
    for rule in cf.rules:
        for rng in str(cf.sqref).split():
            col = "".join(ch_ for ch_ in rng.split(":")[0] if ch_.isalpha())
            ra.conditional_formatting.add(f"{col}5:{col}{LN}", rule)
dvp = DataValidation(type="list", formula1=f"={E}$A$9:$A$13", allow_blank=True)
ra.add_data_validation(dvp); dvp.add(f"W5:W{LN}")
for rr in range(L1, LN + 1):
    for col in "UV": ra[f"{col}{rr}"].number_format = DATA
    for col in "LNQ": ra[f"{col}{rr}"].number_format = DATA

ra["U4"] = None   # o exemplo não entra nas contas
from openpyxl.formatting.rule import FormulaRule
from openpyxl.styles import Font as _F
ac.conditional_formatting.add("L6:L17", FormulaRule(formula=["ISNA(L6)"], font=_F(color="FFFFFF")))
dp.conditional_formatting.add("B19:C49", FormulaRule(formula=["ISNA(B19)"], font=_F(color="FFFFFF")))

if TESTE:
    hoje = datetime.date.today()
    linhas_t = [
        # nome, funil, abordagem, sessão, fechou, valor, fechamento, produto
        ("t1", "Vendas Secretas", datetime.date(2027, 1, 2), datetime.date(2027, 1, 3), "Sim", 5000, datetime.date(2027, 1, 4), "Mentoria completa (exemplo)"),
        ("t2", "Vendas Secretas", datetime.date(2027, 1, 2), datetime.date(2027, 1, 4), "Sim", 1500, datetime.date(2027, 1, 5), "Mentoria VIP · 3 encontros (exemplo)"),
        ("t3", None, datetime.date(2027, 1, 3), None, "Em aberto", None, None, None),
        ("t4", "Lives Secretas", None, datetime.date(2027, 1, 4), "Não", None, None, None),
        ("t5", "Vendas Secretas", datetime.date(2026, 12, 30), datetime.date(2027, 2, 2), "Sim", 300, datetime.date(2027, 2, 3), "Mentoria Destrava · 1 sessão (exemplo)"),
        ("t6", "Vendas Secretas", "28/06", None, "Em aberto", "Pendente", None, None),
    ]
    for i, (n, f, a, s, fe, v, df, p) in enumerate(linhas_t):
        rr = 5 + i
        ra[f"A{rr}"] = n; ra[f"T{rr}"] = f; ra[f"U{rr}"] = a; ra[f"V{rr}"] = s
        ra[f"O{rr}"] = fe; ra[f"P{rr}"] = v; ra[f"Q{rr}"] = df; ra[f"W{rr}"] = p

# ================= VISUAL E INTERATIVIDADE =================
ABAS = [("⌂ Início", "Como usar"), ("Painel", "Painel do mês"), ("Rastreador", "Rastreador de Leads"),
        ("1. Meta", "1. Estratégico"), ("2. Funis", "2. Tático"), ("3. Conta", "3. Operacional"),
        ("4. Rotina", "4. Rotina semanal"), ("5. Acompanh.", "5. Acompanhamento")]
for _, nome in ABAS:
    ws = wb[nome]
    if nome == "Como usar": continue
    lin = 1 if nome == "Rastreador de Leads" else 3      # no Rastreador a linha 3 é o cabeçalho
    for k, (rot, alvo) in enumerate(ABAS):
        c = ws.cell(row=lin, column=4 + k, value=rot)
        atual = alvo == nome
        c.fill = PatternFill("solid", fgColor=LARANJA if atual else PRETO)
        c.font = Font(bold=True, size=9, color=BRANCO, underline=None if atual else "single")
        c.alignment = Alignment(horizontal="center", vertical="center", shrink_to_fit=True)
        c.border = Border(left=Side(style="thin", color=BRANCO), right=Side(style="thin", color=BRANCO))
        if not atual: c.hyperlink = Hyperlink(ref=c.coordinate, location=f"'{alvo}'!A1", display=rot)
    if lin == 3: ws.row_dimensions[3].height = 20
for ws in wb.worksheets:
    ws.sheet_view.showGridLines = False
    ws.sheet_properties.tabColor = {"Painel do mês": LARANJA, "Rastreador de Leads": LARANJA, "Como usar": PRETO}.get(ws.title, "7F7F7F")
    for chx in ws._charts:
        chx.legend.position = "t"; chx.legend.overlay = False
        if chx.title is not None: chx.title.overlay = False
wb.active = wb.index(wb["Painel do mês"])

BOM_F = Font(bold=True, color="2E7D32"); BOM_P = PatternFill(start_color="E8F5E9", end_color="E8F5E9", fill_type="solid")
RUIM_F = Font(bold=True, color=BRANCO); RUIM_P = PatternFill(start_color=LARANJA, end_color=LARANJA, fill_type="solid")
ALERTA_F = Font(bold=True, color=LARANJA)


def bom_ruim(ws, rng, bom, ruim, cheio=True):
    c0 = rng.split(":")[0]
    ws.conditional_formatting.add(rng, FormulaRule(formula=[bom.format(c=c0)], font=BOM_F, fill=BOM_P if cheio else None))
    ws.conditional_formatting.add(rng, FormulaRule(formula=[ruim.format(c=c0)], font=RUIM_F if cheio else ALERTA_F, fill=RUIM_P if cheio else None))


bom_ruim(pa, "B15:G15", 'OR(ISNUMBER(SEARCH("batida",{c})),{c}="No ritmo")', 'ISNUMBER(SEARCH("abaixo",{c}))')
bom_ruim(es, "D18:O18", '{c}="No ritmo"', '{c}="Abaixo"', cheio=False)
bom_ruim(es, "B22", 'ISNUMBER(SEARCH("bate",{c}))', 'ISNUMBER(SEARCH("falta",{c}))')
bom_ruim(es, "B23", '{c}="OK"', 'AND({c}<>"",{c}<>"OK")', cheio=False)
bom_ruim(ta, "H10:H14", '{c}="OK"', 'AND({c}<>"",{c}<>"OK")', cheio=False)
bom_ruim(ta, "H18", '{c}="OK"', 'AND({c}<>"",{c}<>"OK")', cheio=False)
ta.conditional_formatting.add("D6:O6", FormulaRule(formula=['D6<>""'], font=ALERTA_F))
bom_ruim(ac, "E23:G24", 'ISNUMBER(SEARCH("Acima",$E23))', 'ISNUMBER(SEARCH("Abaixo",$E23))')
ac.conditional_formatting.add("J6:J17", DataBarRule(start_type="num", start_value=0, end_type="num", end_value=1, color=LARANJA, showValue=True))
for rr_ in range(1, ro.max_row + 1):
    if ro[f"A{rr_}"].value == "Situação da agenda":
        bom_ruim(ro, f"D{rr_}:O{rr_}", '{c}="Cabe"', '{c}="Passou"')

wb.save(OUT)
print("salvo", OUT)
