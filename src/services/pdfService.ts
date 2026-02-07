import html2pdf from 'html2pdf.js'
import { TestResult } from '../hooks/useTestResults'

interface PdfOptions {
  results: TestResult[]
  includeChart?: boolean
  chartImageData?: string
}

const levelColors: Record<string, string> = {
  minimal: '#16a34a',
  mild: '#eab308',
  moderate: '#f97316',
  severe: '#dc2626'
}

export async function generatePdf({ results, includeChart, chartImageData }: PdfOptions): Promise<void> {
  const now = new Date()
  const dateStr = now.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; color: #1f2937;">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="font-size: 48px; color: #4a6fa5;">Ψ</div>
        <h1 style="margin: 10px 0 5px; color: #4a6fa5;">Отчёт по психологическим тестам</h1>
        <p style="color: #6b7280; margin: 0;">Дата: ${dateStr}</p>
      </div>

      ${includeChart && chartImageData ? `
        <div style="margin-bottom: 30px;">
          <h2 style="color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
            График прогресса
          </h2>
          <img src="${chartImageData}" style="width: 100%; max-height: 300px; object-fit: contain;" />
        </div>
      ` : ''}

      <div style="margin-bottom: 30px;">
        <h2 style="color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
          Результаты тестов (${results.length})
        </h2>

        ${results.map(result => `
          <div style="background: #f9fafb; border-radius: 8px; padding: 15px; margin-bottom: 15px; border-left: 4px solid ${levelColors[result.level]};">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
              <div>
                <h3 style="margin: 0 0 5px; color: #1f2937;">${result.testName}</h3>
                <p style="margin: 0; color: #6b7280; font-size: 14px;">
                  ${new Date(result.date).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 24px; font-weight: bold; color: #4a6fa5;">
                  ${result.score} / ${result.maxScore}
                </div>
                <div style="font-size: 12px; color: ${levelColors[result.level]}; font-weight: 500;">
                  ${result.title}
                </div>
              </div>
            </div>
            <div style="background: #e5e7eb; border-radius: 999px; height: 8px; overflow: hidden;">
              <div style="background: ${levelColors[result.level]}; height: 100%; width: ${(result.score / result.maxScore) * 100}%; border-radius: 999px;"></div>
            </div>
          </div>
        `).join('')}
      </div>

      <div style="background: #fef3c7; border-radius: 8px; padding: 15px; margin-top: 30px;">
        <p style="margin: 0; color: #92400e; font-size: 14px;">
          <strong>⚠️ Важно:</strong> Данный отчёт предназначен для самодиагностики и не является медицинским диагнозом.
          При наличии серьёзных симптомов рекомендуется обратиться к специалисту.
        </p>
      </div>

      <div style="text-align: center; margin-top: 30px; color: #9ca3af; font-size: 12px;">
        <p>Сгенерировано на teloirazum.ru</p>
      </div>
    </div>
  `

  const element = document.createElement('div')
  element.innerHTML = html
  document.body.appendChild(element)

  const opt = {
    margin: 10,
    filename: `psych-tests-report-${now.toISOString().split('T')[0]}.pdf`,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
  }

  try {
    await html2pdf().set(opt).from(element).save()
  } finally {
    document.body.removeChild(element)
  }
}

export async function generateSingleTestPdf(result: TestResult): Promise<void> {
  return generatePdf({ results: [result] })
}
