"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { KontikLogo } from "./kontik-logo"
import { FormField } from "./form-field"
import { SectionDivider } from "./section-divider"
import { CheckCircle2 } from "lucide-react"

const WEBHOOK_URL = process.env.NEXT_PUBLIC_APOIO_WEBHOOK_URL ?? "https://YOUR_WEBHOOK_URL_HERE"

// ─── Option lists ──────────────────────────────────────────────────────────

const SOLICITACAO_OPTIONS = [
  "Admissão",
  "Afastamento",
  "Ativar acesso",
  "Cancelamento",
  "Demissão",
  "Desbloqueio",
  "Duty Of Care",
  "Dúvidas",
  "Falhas",
  "Férias",
  "Implantação",
  "Inativar acesso",
  "Liberar politica OBT",
  "Liberar VCN Cliente",
  "Liberar visão do PVI",
  "Primeiro Acesso",
  "Processos",
  "Reset de MFA",
  "Reset de senha",
  "Status bilhete",
  "Teste",
  "Trilha da Excelência",
  "Troca de área",
  "Zendesk",
]

const EMPRESA_APOIO_OPTIONS = [
  "Benner",
  "Central de emissão",
  "DNIT",
  "Emergencial",
  "Faturamento",
  "Implantação",
  "Inovents",
  "KCS",
  "Kontik Matriz",
  "Kontrip",
  "Operações POA",
  "Operações RJ",
  "Operações SP",
  "Relacionamento",
  "TI",
  "Zupper",
]

const FILA_APOIO_OPTIONS = [
  "Confirmações",
  "Disponiveis",
  "Em Tratativa",
  "Pendências",
  "Resolvido",
  "Tratativa Interna",
]

const ACESSOS_PORTAIS_OPTIONS = [
  "Agent Port",
  "Agent Port EMEA",
  "Argo",
  "Assist Card",
  "Azul",
  "B2B Pay",
  "B2B reservas",
  "Bestbuy",
  "Clickbus",
  "DCP-GOL",
  "Desconsiderado",
  "Drake",
  "E-Htl",
  "E-latam",
  "Flixbus",
  "GDS AMADEUS",
  "GDS SABRE",
  "Gover",
  "GTA",
  "Interface hotels",
  "Lemontech",
  "Localiza",
  "Mobility",
  "Movida Alphaville",
  "Movida RJ",
  "Movida SP",
  "Movida SSA",
  "My Portal",
  "Niara",
  "Ominibees",
  "Passaredo",
  "Portal Gol",
  "Quero passagem",
  "Travel.com",
  "Trend",
  "TT Operadora",
  "Unidas",
  "Universal Assistance",
  "Wooba",
  "Zendesk",
]

const DUTY_OF_CARE_OPTIONS = ["Implementação", "Erros"]

const DUVIDAS_OPTIONS = ["Sabre", "Processos FCM", "Outros", "OBT"]

const FALHAS_OPTIONS = ["Integração", "Emissão"]

const IMPLANTACAO_OPTIONS = ["Criação de profile", "Abertura de Branch", "Hic Table"]

const TARIFAS_OPTIONS = ["Acordo Hotel", "Acordo aéreo", "Acordo locadora"]

const ZENDESK_OPTIONS = ["Ajuste", "Cadastro", "Atualização", "Implantação", "Guide"]

// ─── Conditional field logic ───────────────────────────────────────────────

const ACESSOS_PORTAIS_TRIGGERS = new Set([
  "Admissão",
  "Demissão",
  "Desbloqueio",
  "Liberar VCN Cliente",
  "Liberar visão do PVI",
  "Primeiro Acesso",
  "Reset de senha",
  "Troca de área",
])

type ConditionalField =
  | "acessosPortais"
  | "dutyOfCare"
  | "duvidas"
  | "falhas"
  | "implantacao"
  | "tarifas"
  | "zendesk"
  | null

function getConditionalField(solicitacao: string): ConditionalField {
  if (ACESSOS_PORTAIS_TRIGGERS.has(solicitacao)) return "acessosPortais"
  if (solicitacao === "Duty Of Care") return "dutyOfCare"
  if (solicitacao === "Dúvidas") return "duvidas"
  if (solicitacao === "Falhas") return "falhas"
  if (solicitacao === "Implantação") return "implantacao"
  if (solicitacao === "Teste") return "tarifas"
  if (solicitacao === "Zendesk") return "zendesk"
  return null
}

// ─── Types ─────────────────────────────────────────────────────────────────

interface FormState {
  solicitacao: string
  acessosPortais: string
  dutyOfCare: string
  duvidas: string
  falhas: string
  implantacao: string
  tarifas: string
  zendesk: string
  empresaApoio: string
  filaAtendimento: string
}

interface FormErrors {
  empresaApoio?: string
  filaAtendimento?: string
}

const INITIAL_STATE: FormState = {
  solicitacao: "",
  acessosPortais: "",
  dutyOfCare: "",
  duvidas: "",
  falhas: "",
  implantacao: "",
  tarifas: "",
  zendesk: "",
  empresaApoio: "",
  filaAtendimento: "",
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

export function ApoioOperacionalForm() {
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

  function handleSolicitacaoChange(v: string) {
    const prev = form.solicitacao
    const prevField = getConditionalField(prev)
    const nextField = getConditionalField(v)
    setForm((current) => {
      const updated = { ...current, solicitacao: v }
      if (prevField && prevField !== nextField) {
        updated[prevField] = ""
      }
      return updated
    })
  }

  function validate(): FormErrors {
    const e: FormErrors = {}
    if (!form.empresaApoio) e.empresaApoio = "Campo obrigatório"
    if (!form.filaAtendimento) e.filaAtendimento = "Campo obrigatório"
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError("")

    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      const firstErrorEl = errs.empresaApoio
        ? document.getElementById("empresaApoio")
        : document.getElementById("filaAtendimento")
      firstErrorEl?.scrollIntoView({ behavior: "smooth", block: "center" })
      return
    }

    setSubmitting(true)
    try {
      const conditionalField = getConditionalField(form.solicitacao)
      const conditionalValue = conditionalField ? form[conditionalField] : undefined

      const payload: Record<string, string | undefined> = {
        solicitacao: form.solicitacao || undefined,
        empresa_apoio: form.empresaApoio,
        fila_atendimento_apoio: form.filaAtendimento,
      }

      if (conditionalField === "acessosPortais") payload.acessos_portais = form.acessosPortais || undefined
      else if (conditionalField === "dutyOfCare") payload.duty_of_care = form.dutyOfCare || undefined
      else if (conditionalField === "duvidas") payload.duvidas = form.duvidas || undefined
      else if (conditionalField === "falhas") payload.falhas = form.falhas || undefined
      else if (conditionalField === "implantacao") payload.implantacao = form.implantacao || undefined
      else if (conditionalField === "tarifas") payload.tarifas = form.tarifas || undefined
      else if (conditionalField === "zendesk") payload.zendesk = form.zendesk || undefined

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

  const conditionalField = getConditionalField(form.solicitacao)

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#f4f5f3" }}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center max-w-md w-full">
          <CheckCircle2 size={52} className="mx-auto mb-4" style={{ color: "#C2D82F" }} />
          <p className="text-lg font-semibold" style={{ color: "#404653" }}>
            Formulário enviado com sucesso!
          </p>
          <p className="text-sm mt-2" style={{ color: "#9aa0ad" }}>
            O apoio operacional foi registrado.
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
                Formulário de Apoio Operacional
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
              <SectionDivider title="Dados da Solicitação" />

              {/* 1. Solicitação */}
              <FormField label="Solicitação" htmlFor="solicitacao">
                <NativeSelect
                  id="solicitacao"
                  options={SOLICITACAO_OPTIONS}
                  value={form.solicitacao}
                  onChange={handleSolicitacaoChange}
                />
              </FormField>

              {/* Conditional: Acessos Portais */}
              {conditionalField === "acessosPortais" && (
                <FormField label="Acessos Portais" htmlFor="acessosPortais">
                  <NativeSelect
                    id="acessosPortais"
                    options={ACESSOS_PORTAIS_OPTIONS}
                    value={form.acessosPortais}
                    onChange={(v) => set("acessosPortais", v)}
                  />
                </FormField>
              )}

              {/* Conditional: Duty of Care */}
              {conditionalField === "dutyOfCare" && (
                <FormField label="Duty of Care" htmlFor="dutyOfCare">
                  <NativeSelect
                    id="dutyOfCare"
                    options={DUTY_OF_CARE_OPTIONS}
                    value={form.dutyOfCare}
                    onChange={(v) => set("dutyOfCare", v)}
                  />
                </FormField>
              )}

              {/* Conditional: Dúvidas */}
              {conditionalField === "duvidas" && (
                <FormField label="Dúvidas" htmlFor="duvidas">
                  <NativeSelect
                    id="duvidas"
                    options={DUVIDAS_OPTIONS}
                    value={form.duvidas}
                    onChange={(v) => set("duvidas", v)}
                  />
                </FormField>
              )}

              {/* Conditional: Falhas */}
              {conditionalField === "falhas" && (
                <FormField label="Falhas" htmlFor="falhas">
                  <NativeSelect
                    id="falhas"
                    options={FALHAS_OPTIONS}
                    value={form.falhas}
                    onChange={(v) => set("falhas", v)}
                  />
                </FormField>
              )}

              {/* Conditional: Implantação */}
              {conditionalField === "implantacao" && (
                <FormField label="Implantação" htmlFor="implantacao">
                  <NativeSelect
                    id="implantacao"
                    options={IMPLANTACAO_OPTIONS}
                    value={form.implantacao}
                    onChange={(v) => set("implantacao", v)}
                  />
                </FormField>
              )}

              {/* Conditional: Tarifas */}
              {conditionalField === "tarifas" && (
                <FormField label="Tarifas" htmlFor="tarifas">
                  <NativeSelect
                    id="tarifas"
                    options={TARIFAS_OPTIONS}
                    value={form.tarifas}
                    onChange={(v) => set("tarifas", v)}
                  />
                </FormField>
              )}

              {/* Conditional: Zendesk */}
              {conditionalField === "zendesk" && (
                <FormField label="Zendesk" htmlFor="zendesk">
                  <NativeSelect
                    id="zendesk"
                    options={ZENDESK_OPTIONS}
                    value={form.zendesk}
                    onChange={(v) => set("zendesk", v)}
                  />
                </FormField>
              )}

              {/* 2. Empresa Apoio */}
              <FormField
                label="Empresa Apoio"
                required
                error={errors.empresaApoio}
                htmlFor="empresaApoio"
              >
                <NativeSelect
                  id="empresaApoio"
                  options={EMPRESA_APOIO_OPTIONS}
                  value={form.empresaApoio}
                  onChange={(v) => set("empresaApoio", v)}
                  error={errors.empresaApoio}
                  required
                />
              </FormField>

              {/* 3. Fila de Atendimento Apoio */}
              <FormField
                label="Fila de Atendimento Apoio"
                required
                error={errors.filaAtendimento}
                htmlFor="filaAtendimento"
              >
                <NativeSelect
                  id="filaAtendimento"
                  options={FILA_APOIO_OPTIONS}
                  value={form.filaAtendimento}
                  onChange={(v) => set("filaAtendimento", v)}
                  error={errors.filaAtendimento}
                  required
                />
              </FormField>

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
