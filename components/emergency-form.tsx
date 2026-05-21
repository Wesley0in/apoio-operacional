"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { KontikLogo } from "./kontik-logo"
import { SearchableSelect } from "./searchable-select"
import { FormField } from "./form-field"
import { SectionDivider } from "./section-divider"
import { CheckCircle2 } from "lucide-react"

const WEBHOOK_URL = process.env.NEXT_PUBLIC_WEBHOOK_URL ?? "https://YOUR_WEBHOOK_URL_HERE"

// ─── Option lists ──────────────────────────────────────────────────────────
const ATENDENTES = ["Herbert Santana", "Flávio Mazzola", "Samantha Oliveira", "Não se aplica"]

const GRUPOS_EMPRESA = [
  "G4 Educação", "Grupo Abegas", "Grupo Acelen", "Grupo Aché", "Grupo Action Line",
  "Grupo Adidas", "Grupo ADM - Archer Daniels Midland Company", "Grupo Aeroleo",
  "Grupo AET TANKERS", "Grupo Agoro Carbon", "Grupo Airbus - Helibras", "Grupo Alares",
  "Grupo Alliança", "Grupo Amadeus", "Grupo Amcham Brasil", "Grupo Amway",
  "Grupo Arcadis", "Grupo Arezzo Varejo", "Grupo Argo", "Grupo Artesano Urbanismo",
  "Grupo Arxada", "Grupo Aspen Pharma", "Grupo Atento", "Grupo Atlas Copco",
  "Grupo Atos", "Grupo Avaya", "Grupo Avenida", "Grupo Axa", "Grupo Bahia Am Renda",
  "Grupo Bahia Mineração", "Grupo Baker McKenzie - Trench Rossi", "Grupo Banco Bbm",
  "Grupo Banco Caixa Geral Brasil", "Grupo Banco Genial", "Grupo Basf", "Grupo BAT",
  "Grupo Bernoulli Educação", "Grupo BHAirport", "Grupo Bioage", "Grupo Biolab",
  "Grupo Biomerieux", "Grupo Blu Pagamentos", "Grupo Bosch", "Grupo Braskem",
  "Grupo Bristow", "Grupo Brq It Services", "Grupo Camargo Correa", "Grupo Carmo Energy",
  "Grupo Carol Bassi", "Grupo Casas Bahia", "Grupo Case", "Grupo Cbo", "Grupo Chanel",
  "Grupo Cielo", "Grupo Claro Sa", "Grupo Cma", "Grupo Cmoc", "Grupo Cobra",
  "Grupo Comgas", "Grupo Conceba", "Grupo Concer", "Grupo Constellation",
  "Grupo Consulado Britanico", "Grupo Credibrf", "Grupo Credipronto", "Grupo Cvc Capital",
  "Grupo Cyncly", "Grupo Deloitte", "Grupo Diageo", "Grupo Eai – Grupo Ultra",
  "Grupo Ecp", "Grupo Efi", "Grupo Elanco", "Grupo Eletrobrás", "Grupo Elis Energia",
  "Grupo Enaex", "Grupo Energisa", "Grupo Enerpac", "Grupo Engelhart Ctp",
  "Grupo Epson", "Grupo Erb", "Grupo Estre Ambiental", "Grupo Extrafarma",
  "Grupo Falcon Active", "Grupo FCDO", "Grupo Fcm Global", "Grupo Ferreira Costa",
  "Grupo Firmenich", "Grupo First Solar", "Grupo Fm Global", "Grupo Fortlev",
  "Grupo Fraport", "Grupo Fs Bioenergia", "Grupo Garrett", "Grupo Gic", "Grupo Glory",
  "Grupo Greif", "Grupo Gtm", "Grupo HIAE - Hospital Albert Einstein", "Grupo Honeywell",
  "Grupo Hotel", "Grupo Hotelbeds", "Grupo HPE – Mitsubishi", "Grupo Htb",
  "Grupo Hypera", "Grupo Ibemapar", "Grupo Ihs", "Grupo Inframerica",
  "Grupo Innomotics", "Grupo Inovents", "Grupo Instituto Unibanco", "Grupo Intecom",
  "Grupo Intercement", "Grupo Invepar", "Grupo Ipiranga",
]

const SOLICITACAO_EMERGENCIAL = ["On-line", "Off-line"]
const SOLICITACOES = ["Internacional", "Nacional"]
const FORNECEDOR = ["Aéreo", "Carro", "Hotel", "Rodoviário", "Seguro Viagem", "Transfer"]
const CANAL = ["E-mail", "Telefone", "OBT", "WhatsApp"]
const SERVICO = [
  "Alteração", "Cancelamento", "Cotação", "Direcionado ao Posto", "Emissão",
  "Fora do Escopo – Atendido", "Informações", "Ligação", "Reenvio",
  "Regularização de Pagamento", "Reserva", "Suporte Interno", "Transfer",
]
const LOCAL_RESERVA = ["B2B", "Best Buy", "Direto no hotel", "EHTL", "Omnibees", "Outros", "Sabre", "Trend"]
const JUSTIFICATIVA = [
  "Solicitação não tratada em horário comercial", "Solicitação Emergencial",
  "Erro do Sistema", "Solicitação Depto Comercial", "Suporte Interno",
]
const FILA = [
  "Atualizados - Fora do horário", "Claro", "Confirmações", "Em Tratativa",
  "Falha de Emissão", "Fora do Horário", "Monitoramento",
  "Pendência de Contabilização", "Pendências",
]

// ─── Types ─────────────────────────────────────────────────────────────────
interface FormState {
  atendente: string
  grupoEmpresa: string
  solicitacaoEmergencial: string
  solicitacoes: string
  sobrenomeNome: string
  localizador: string
  matricula: string
  centroCusto: string
  observacoes: string
  fornecedor: string
  canal: string
  servico: string
  localReserva: string
  justificativa: string
  filaAtendimento: string
  emergencialCopia: boolean
  emailEnviado: boolean
}

interface FormErrors {
  atendente?: string
  grupoEmpresa?: string
  solicitacoes?: string
  sobrenomeNome?: string
  localizador?: string
  matricula?: string
  centroCusto?: string
  fornecedor?: string
  servico?: string
  localReserva?: string
  justificativa?: string
}

const INITIAL_STATE: FormState = {
  atendente: "",
  grupoEmpresa: "",
  solicitacaoEmergencial: "",
  solicitacoes: "",
  sobrenomeNome: "",
  localizador: "",
  matricula: "",
  centroCusto: "",
  observacoes: "",
  fornecedor: "",
  canal: "",
  servico: "",
  localReserva: "",
  justificativa: "",
  filaAtendimento: "",
  emergencialCopia: false,
  emailEnviado: false,
}

// ─── Shared input styles ───────────────────────────────────────────────────
const inputBase =
  "w-full px-3 py-2.5 text-sm rounded-[6px] border border-[#404653] bg-white text-[#404653] outline-none transition-all focus:ring-2 focus:ring-offset-0 focus:ring-[#C2D82F]/50 focus:border-[#C2D82F] placeholder:text-[#9aa0ad]"
const inputError = "border-red-500 focus:ring-red-200"

function NativeSelect({
  options,
  value,
  onChange,
  id,
  error,
  required,
}: {
  options: string[]
  value: string
  onChange: (v: string) => void
  id?: string
  error?: string
  required?: boolean
}) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          inputBase,
          "appearance-none pr-9 cursor-pointer",
          !value && "text-[#9aa0ad]",
          error && inputError
        )}
        style={{ color: value ? "#404653" : undefined }}
      >
        <option value="" disabled>Selecione...</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 6l4 4 4-4" stroke="#404653" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────
export function EmergencyForm() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submitError, setSubmitError] = useState("")

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (key in errors) {
      setErrors((prev) => ({ ...prev, [key]: undefined }))
    }
  }

  function validate(): FormErrors {
    const e: FormErrors = {}
    if (!form.atendente) e.atendente = "Campo obrigatório"
    if (!form.grupoEmpresa) e.grupoEmpresa = "Campo obrigatório"
    if (!form.solicitacoes) e.solicitacoes = "Campo obrigatório"
    if (!form.sobrenomeNome.trim()) e.sobrenomeNome = "Campo obrigatório"
    if (!form.localizador.trim()) e.localizador = "Campo obrigatório"
    if (!form.matricula.trim()) e.matricula = "Campo obrigatório"
    if (!form.centroCusto.trim()) e.centroCusto = "Campo obrigatório"
    if (!form.fornecedor) e.fornecedor = "Campo obrigatório"
    if (!form.servico) e.servico = "Campo obrigatório"
    if (!form.localReserva) e.localReserva = "Campo obrigatório"
    if (!form.justificativa) e.justificativa = "Campo obrigatório"
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError("")

    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      // scroll to first error
      const firstKey = Object.keys(errs)[0]
      const el = document.getElementById(firstKey)
      el?.scrollIntoView({ behavior: "smooth", block: "center" })
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        atendente_extra: form.atendente,
        grupo_empresa: form.grupoEmpresa,
        solicitacao_emergencial: form.solicitacaoEmergencial,
        solicitacoes: form.solicitacoes,
        sobrenome_nome_passageiro: form.sobrenomeNome,
        localizador: form.localizador,
        matricula: form.matricula,
        centro_de_custo: form.centroCusto,
        observacoes: form.observacoes,
        fornecedor_emergencial: form.fornecedor,
        canal_de_atendimento: form.canal,
        servico_emergencial: form.servico,
        local_de_reserva_emergencial: form.localReserva,
        justificativa_emergencial: form.justificativa,
        fila_de_atendimento_emergencial: form.filaAtendimento,
        emergencial_estava_em_copia: form.emergencialCopia,
        email_enviado_ao_emergencial: form.emailEnviado,
      }

      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setSuccess(true)
      setForm(INITIAL_STATE)
    } catch {
      setSubmitError("Erro ao enviar formulário. Tente novamente.")
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#f4f5f3" }}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center max-w-md w-full">
          <CheckCircle2 size={52} className="mx-auto mb-4" style={{ color: "#C2D82F" }} />
          <p className="text-lg font-semibold" style={{ color: "#404653" }}>
            Formulário enviado com sucesso!
          </p>
          <p className="text-sm mt-2" style={{ color: "#9aa0ad" }}>
            O atendimento emergencial foi registrado.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="mt-6 text-sm font-medium underline"
            style={{ color: "#404653" }}
          >
            Preencher novo formulário
          </button>
        </div>
      </div>
    )
  }

  return (
    <main
      className="min-h-screen py-10 px-4 font-sans"
      style={{ background: "#f4f5f3" }}
    >
      <div className="mx-auto w-full max-w-[720px]">
        {/* Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header bar */}
          <div className="h-1.5 w-full" style={{ background: "#C2D82F" }} />

          <div className="px-8 pt-8 pb-10 sm:px-10">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <KontikLogo />
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h1
                className="text-xl font-bold tracking-tight text-balance"
                style={{ color: "#404653" }}
              >
                Formulário de Atendimento Emergencial
              </h1>
              <p className="text-sm mt-1.5 leading-relaxed" style={{ color: "#9aa0ad" }}>
                Preencha todos os campos obrigatórios antes de finalizar o atendimento
              </p>
              <p className="text-xs mt-2" style={{ color: "#9aa0ad" }}>
                Campos marcados com{" "}
                <span style={{ color: "#E31F26" }}>*</span> são obrigatórios
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              {/* ── Seção: Equipe ─────────────────────────────────────────── */}
              <SectionDivider title="Equipe e Empresa" />

              {/* 1. Atendente Extra */}
              <FormField
                label="Atendente Extra"
                required
                error={errors.atendente}
                htmlFor="atendente"
              >
                <NativeSelect
                  id="atendente"
                  options={ATENDENTES}
                  value={form.atendente}
                  onChange={(v) => set("atendente", v)}
                  error={errors.atendente}
                  required
                />
              </FormField>

              {/* 2. Grupo Empresa */}
              <FormField
                label="Grupo Empresa"
                required
                error={errors.grupoEmpresa}
                htmlFor="grupoEmpresa"
              >
                <SearchableSelect
                  id="grupoEmpresa"
                  options={GRUPOS_EMPRESA}
                  value={form.grupoEmpresa}
                  onChange={(v) => set("grupoEmpresa", v)}
                  error={errors.grupoEmpresa}
                  required
                />
              </FormField>

              {/* ── Seção: Solicitação ────────────────────────────────────── */}
              <SectionDivider title="Dados da Solicitação" />

              {/* 3. Solicitação Emergencial */}
              <FormField
                label="Solicitação Emergencial"
                htmlFor="solicitacaoEmergencial"
              >
                <NativeSelect
                  id="solicitacaoEmergencial"
                  options={SOLICITACAO_EMERGENCIAL}
                  value={form.solicitacaoEmergencial}
                  onChange={(v) => set("solicitacaoEmergencial", v)}
                />
              </FormField>

              {/* 4. Solicitações */}
              <FormField
                label="Solicitações (nacional e internacional)"
                required
                error={errors.solicitacoes}
                htmlFor="solicitacoes"
              >
                <NativeSelect
                  id="solicitacoes"
                  options={SOLICITACOES}
                  value={form.solicitacoes}
                  onChange={(v) => set("solicitacoes", v)}
                  error={errors.solicitacoes}
                  required
                />
              </FormField>

              {/* ── Seção: Passageiro ─────────────────────────────────────── */}
              <SectionDivider title="Dados do Passageiro" />

              {/* 5. Sobrenome/Nome Passageiro */}
              <FormField
                label="Sobrenome/Nome Passageiro"
                required
                error={errors.sobrenomeNome}
                htmlFor="sobrenomeNome"
              >
                <input
                  id="sobrenomeNome"
                  type="text"
                  value={form.sobrenomeNome}
                  onChange={(e) => set("sobrenomeNome", e.target.value)}
                  placeholder="Ex: Silva / João"
                  required
                  className={cn(inputBase, errors.sobrenomeNome && inputError)}
                />
              </FormField>

              {/* 6 & 7 — Two columns on wider screens */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 6. Localizador */}
                <FormField
                  label="Localizador"
                  required
                  error={errors.localizador}
                  htmlFor="localizador"
                >
                  <input
                    id="localizador"
                    type="text"
                    value={form.localizador}
                    onChange={(e) => set("localizador", e.target.value)}
                    placeholder="Ex: ABC123"
                    required
                    className={cn(inputBase, errors.localizador && inputError)}
                  />
                </FormField>

                {/* 7. Matrícula */}
                <FormField
                  label="Matrícula"
                  required
                  error={errors.matricula}
                  htmlFor="matricula"
                >
                  <input
                    id="matricula"
                    type="text"
                    value={form.matricula}
                    onChange={(e) => set("matricula", e.target.value)}
                    placeholder="Ex: 00123"
                    required
                    className={cn(inputBase, errors.matricula && inputError)}
                  />
                </FormField>
              </div>

              {/* 8. Centro de Custo */}
              <FormField
                label="Centro de Custo"
                required
                error={errors.centroCusto}
                htmlFor="centroCusto"
              >
                <input
                  id="centroCusto"
                  type="text"
                  value={form.centroCusto}
                  onChange={(e) => set("centroCusto", e.target.value)}
                  placeholder="Ex: CC-0042"
                  required
                  className={cn(inputBase, errors.centroCusto && inputError)}
                />
              </FormField>

              {/* 9. Observações */}
              <FormField label="Observações" htmlFor="observacoes">
                <textarea
                  id="observacoes"
                  rows={3}
                  value={form.observacoes}
                  onChange={(e) => set("observacoes", e.target.value)}
                  placeholder="Informações adicionais..."
                  className={cn(inputBase, "resize-none")}
                />
              </FormField>

              {/* ── Seção: Emergencial ────────────────────────────────────── */}
              <SectionDivider title="Dados Emergenciais" />

              {/* 10. Fornecedor */}
              <FormField
                label="Fornecedor - Emergencial"
                required
                error={errors.fornecedor}
                htmlFor="fornecedor"
              >
                <NativeSelect
                  id="fornecedor"
                  options={FORNECEDOR}
                  value={form.fornecedor}
                  onChange={(v) => set("fornecedor", v)}
                  error={errors.fornecedor}
                  required
                />
              </FormField>

              {/* 11 & 12 — Two columns on wider screens */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 11. Canal de Atendimento */}
                <FormField
                  label="Canal de Atendimento"
                  htmlFor="canal"
                >
                  <NativeSelect
                    id="canal"
                    options={CANAL}
                    value={form.canal}
                    onChange={(v) => set("canal", v)}
                  />
                </FormField>

                {/* 12. Serviço - Emergencial */}
                <FormField
                  label="Serviço - Emergencial"
                  required
                  error={errors.servico}
                  htmlFor="servico"
                >
                  <NativeSelect
                    id="servico"
                    options={SERVICO}
                    value={form.servico}
                    onChange={(v) => set("servico", v)}
                    error={errors.servico}
                    required
                  />
                </FormField>
              </div>

              {/* 13. Local de Reserva */}
              <FormField
                label="Local de Reserva - Emergencial"
                required
                error={errors.localReserva}
                htmlFor="localReserva"
              >
                <NativeSelect
                  id="localReserva"
                  options={LOCAL_RESERVA}
                  value={form.localReserva}
                  onChange={(v) => set("localReserva", v)}
                  error={errors.localReserva}
                  required
                />
              </FormField>

              {/* 14. Justificativa */}
              <FormField
                label="Justificativa - Emergencial"
                required
                error={errors.justificativa}
                htmlFor="justificativa"
              >
                <NativeSelect
                  id="justificativa"
                  options={JUSTIFICATIVA}
                  value={form.justificativa}
                  onChange={(v) => set("justificativa", v)}
                  error={errors.justificativa}
                  required
                />
              </FormField>

              {/* 15. Fila de Atendimento */}
              <FormField
                label="Fila de Atendimento Emergencial"
                htmlFor="filaAtendimento"
              >
                <NativeSelect
                  id="filaAtendimento"
                  options={FILA}
                  value={form.filaAtendimento}
                  onChange={(v) => set("filaAtendimento", v)}
                />
              </FormField>

              {/* ── Seção: Confirmações ───────────────────────────────────── */}
              <SectionDivider title="Confirmações" />

              {/* 16 & 17. Checkboxes */}
              <div className="flex flex-col gap-3">
                {/* 16 */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={form.emergencialCopia}
                    onChange={(e) => set("emergencialCopia", e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#404653] cursor-pointer accent-[#C2D82F]"
                  />
                  <span className="text-sm leading-relaxed" style={{ color: "#404653" }}>
                    Emergencial estava em cópia
                  </span>
                </label>

                {/* 17 */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={form.emailEnviado}
                    onChange={(e) => set("emailEnviado", e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#404653] cursor-pointer accent-[#C2D82F]"
                  />
                  <span className="text-sm leading-relaxed" style={{ color: "#404653" }}>
                    E-mail enviado ao emergencial/horário do posto
                  </span>
                </label>
              </div>

              {/* ── Submit error ─────────────────────────────────────────── */}
              {submitError && (
                <p
                  className="text-sm font-medium text-center py-2 px-3 rounded-[6px] bg-red-50"
                  style={{ color: "#E31F26" }}
                  role="alert"
                >
                  {submitError}
                </p>
              )}

              {/* ── Submit button ─────────────────────────────────────────── */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className={cn(
                    "w-full py-3 rounded-[6px] text-sm font-semibold tracking-wide transition-all",
                    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C2D82F]",
                    submitting
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:brightness-95 active:scale-[0.99]"
                  )}
                  style={{
                    background: "#C2D82F",
                    color: "#404653",
                  }}
                >
                  {submitting ? "Enviando..." : "Enviar Formulário"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs mt-5" style={{ color: "#b0b5be" }}>
          © {new Date().getFullYear()} Kontik Business Travel. Todos os direitos reservados.
        </p>
      </div>
    </main>
  )
}
