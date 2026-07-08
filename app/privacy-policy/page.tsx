import type { Metadata } from 'next'
import Header from '../components/Header'
import Footer from '../sections/Footer'
import SmoothScrollProvider from '../components/SmoothScrollProvider'
import { getSiteConfig } from '../lib/site-config-store'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: '隐私政策 | Papa Claw 爬爬虾',
  description: 'Papa Claw 爬爬虾官网隐私政策，说明我们如何收集、使用、保存和保护用户信息。',
  alternates: {
    canonical: '/privacy-policy',
  },
}

const sections = [
  {
    title: '一、我们收集的信息',
    body: [
      '当你浏览 papaclaw.cn、提交咨询需求、发送邮件或通过社交媒体联系我们时，我们可能会收集你的姓名、公司名称、联系方式、业务需求、沟通记录，以及浏览器、设备、访问时间、来源页面等基础访问数据。',
      '如果你只是浏览官网，我们通常只会获得用于网站运行、安全防护和访问统计的必要信息。',
    ],
  },
  {
    title: '二、信息使用目的',
    body: [
      '我们使用这些信息，是为了回应你的咨询、评估合作需求、提供 AI 出海获客、跨境直播、GEO 优化、政企资源对接等相关服务，并持续改进官网内容、服务流程和用户体验。',
      '我们不会出售你的个人信息，也不会把你的咨询内容用于与服务无关的公开宣传。',
    ],
  },
  {
    title: '三、信息保存与保护',
    body: [
      '我们会在实现上述目的所需的期限内保存相关信息，并采取合理的管理和技术措施，降低信息被未经授权访问、披露、篡改或丢失的风险。',
      '互联网传输并不存在绝对安全，我们会尽力保护你的信息，但无法承诺任何传输或存储方式百分之百安全。',
    ],
  },
  {
    title: '四、第三方服务',
    body: [
      '官网可能使用部署、存储、统计、表单、邮件或社交平台等第三方服务。相关第三方可能基于其自身隐私政策处理必要数据。',
      '当你点击视频号、小红书、知乎、头条或其他外部平台链接时，将进入对应平台页面，相关数据处理规则以该平台政策为准。',
    ],
  },
  {
    title: '五、你的权利',
    body: [
      '你可以通过邮件联系我们，要求查询、更正或删除你主动提供的信息，也可以要求我们停止用于后续业务沟通。',
      '为保护信息安全，我们可能需要先验证你的身份和请求范围。',
    ],
  },
  {
    title: '六、政策更新',
    body: [
      '我们可能因业务、技术或法律要求更新本政策。更新后会在本页面发布，页面显示的更新日期即为最新生效日期。',
    ],
  },
]

export default async function PrivacyPolicyPage() {
  const config = (await getSiteConfig()) as any
  const headerMenuItems = config.header.menuItems.filter(
    (item: string) => !item.includes('落地流程') && !item.includes('路径')
  )

  return (
    <SmoothScrollProvider>
      <main className="min-h-screen bg-[#F7F7F5] text-[#0F1C1A]">
        <Header menuItems={headerMenuItems} whatsappUrl={config.header.whatsappUrl} />

        <section className="p-section pt-36">
          <div className="p-inner">
            <p className="p-kicker mb-4 text-center">Privacy Policy</p>
            <h1 className="p-heading-xl mx-auto max-w-4xl text-center">隐私政策</h1>
            <p className="p-body mx-auto mt-6 max-w-3xl text-center">
              本政策适用于 Papa Claw 爬爬虾官网及通过官网产生的咨询、沟通和服务线索。最近更新：2026年7月8日。
            </p>

            <div className="mx-auto mt-14 max-w-4xl border-t border-[#E5E5E0] bg-white">
              {sections.map((section) => (
                <section key={section.title} className="border-b border-[#E5E5E0] p-6 md:p-8">
                  <h2 className="p-heading text-2xl">{section.title}</h2>
                  <div className="mt-5 space-y-4">
                    {section.body.map((paragraph) => (
                      <p key={paragraph} className="p-body">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}

              <section className="p-6 md:p-8">
                <h2 className="p-heading text-2xl">七、联系我们</h2>
                <p className="p-body mt-5">
                  如你对本隐私政策或个人信息处理有疑问，请通过邮箱联系：Robin@papaclaw.cn。
                </p>
              </section>
            </div>
          </div>
        </section>

        <Footer
          contactTitle={config.footer.contactTitle}
          contactDescription={config.footer.contactDescription}
          ctaText={config.footer.ctaText}
          socialLinks={config.footer.socialLinks}
          copyright={config.footer.copyright}
          legalLinks={config.footer.legalLinks}
          credit={config.footer.credit}
        />
      </main>
    </SmoothScrollProvider>
  )
}
