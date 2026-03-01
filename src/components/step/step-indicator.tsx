interface StepIndicatorProps {
  steps: { number: number; title: string }[]
  currentStep: number
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="space-y-4">
      {steps.map((step) => (
        <div key={step.number} className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
              currentStep === step.number
                ? "bg-[#f0f0f0] text-black shadow-md border border-[#000000]"
                : currentStep > step.number
                  ? "bg-[#F2C94C] text-black"
                  : " border border-[#1717171A] text-gray-600"
            }`}
          >
            {currentStep > step.number ? "✓" : step.number}
          </div>
          <span className={`text-xs font-semibold ${currentStep === step.number ? "text-[#171717]" : "text-gray-600"}`}>
            {step.title}
          </span>
        </div>
      ))}
    </div>
  )
}
