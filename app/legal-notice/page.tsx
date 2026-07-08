import type { Metadata } from 'next'
import Header from '../components/Header'
import Footer from '../sections/Footer'
import SmoothScrollProvider from '../components/SmoothScrollProvider'
import { getSiteConfig } from '../lib/site-config-store'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: '法律声明 | Papa Claw 爬爬虾',
  description: 'Papa Claw 爬爬虾官网法律声明，说明网站内容、知识产权、服务边界、外部链接和免责声明。',
  alternates: {
    canonical: '/legal-notice',
  },
}

const sections = [
  {
    title: '一、网站主体',
    body: [
      'papaclaw.cn 为 Papa Claw 爬爬虾官方网站。Papa Claw 爬爬虾的法律主体为爬爬虾数据科技有限公司。',
      '本网站用于展示品牌定位、服务内容、公开案例、新闻内容、联系方式及与 AI 出海获客相关的信息。',
    ],
  },
  {
    title: '二、内容说明',
    body: [
      '网站中的案例、数据、文章和服务说明基于我们可公开披露的信息整理，目的是帮助访问者了解 Papa Claw 爬爬虾的能力边界和合作方式。',
      '网站内容不构成投资、融资、法律、税务、会计或其他专业意见。任何业务决策仍应结合自身情况，并咨询相应专业人士。',
    ],
  },
  {
    title: '三、服务边界',
    body: [
      'Papa Claw 爬爬虾提供 AI 内容生产、多平台账号矩阵运营、GEO 优化、跨境直播电商系统、政企资源对接和跨境金融协同等相关服务。',
      '我们不承诺百分百中标、百分百盈利、保证订单或保证成交。实际结果会受到产品、价格、市场竞争、销售跟进、客户信任、履约能力等多重因素影响。',
    ],
  },
  {
    title: '四、知识产权',
    body: [
      '除特别注明外，本网站的文字、页面设计、视觉元素、结构化内容、品牌名称和相关资料归 Papa Claw 爬爬虾或相应权利人所有。',
      '未经书面许可，不得将本网站内容用于误导性宣传、商业转载、批量抓取、训练数据包装或与 Papa Claw 爬爬虾无关的商业背书。',
    ],
  },
  {
    title: '五、外部链接',
    body: [
      '本网站可能包含视频号、小红书、知乎、头条、第三方新闻或合作平台链接。外部网站由其运营方负责，我们不对其内容、可用性或数据处理方式承担责任。',
      '访问外部链接前，请自行判断相关内容的真实性、完整性和适用性。',
    ],
  },
  {
    title: '六、责任限制',
    body: [
      '我们会尽力保持网站信息准确、及时和稳定，但不保证所有内容在任何时间都完全无误或不间断可用。',
      '因使用或无法使用本网站内容而产生的直接或间接损失，除法律另有强制规定外，Papa Claw 爬爬虾不承担超出合理范围的责任。',
    ],
  },
]

export default async function LegalNoticePage() {
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
            <p className="p-kicker mb-4 text-center">Legal Notice</p>
            <h1 className="p-heading-xl mx-auto max-w-4xl text-center">法律声明</h1>
            <p className="p-body mx-auto mt-6 max-w-3xl text-center">
              访问或使用本网站，即表示你已阅读并理解本声明。最近更新：2026年7月8日。
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
                  如你发现网站内容存在错误、侵权或需要更正的信息，请通过邮箱联系：Robin@papaclaw.cn。
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
