'use client'

import Reveal from '../components/Reveal'
import AnimatedText from '../components/AnimatedText'
import Counter from '../components/Counter'

export default function About() {
  const stats = [
    { value: 3, suffix: '亿', label: '9个月帮客户成交' },
    { value: 7, suffix: '年', label: '合作主播直播经验' },
    { value: 100, suffix: '+', label: '单场直播SKU上新量' },
  ]

  return (
    <section id="about" className="p-section border-t border-[#E5E5E0] bg-[#F7F7F5] py-24 md:py-32">
      <div className="p-inner">
        <div className="mb-20 grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="p-kicker mb-6">Positioning</p>
            </Reveal>
            <AnimatedText as="h2" className="p-heading-xl">
              获客不是先投广告，是先让客户找到你。
            </AnimatedText>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal delay={0.2}>
              <p className="p-body-lg">
                我们这支队伍在海外待了 14 年，中东的坑踩过，楼卖过，十几亿的盘也操过。现在把这些经验和人脉搬回了南沙。
              </p>
              <p className="p-body-lg mt-6">
                我们也在香港跑过直播带货。帮DABIE搭建自研 DABIE ERP 系统，管库存、管成本、管对账；直播间同时在线做到 1000+ 人，全网粉丝 4 万+，30 多个账号矩阵一起运营。出海不是只有一种打法，卖货这件事我们线上线下都趟过。
              </p>
              <p className="p-body-lg mt-6">
                别人做出海靠砸广告费，我们靠让AI和内容替你获客。办公室不大，人不堆，排场不撑，钱全花在帮客户拿订单这件事上。
              </p>
            </Reveal>
          </div>
        </div>

        <div className="p-rule mb-0" />
        <div className="grid divide-y divide-[#E5E5E0] md:grid-cols-3 md:divide-x md:divide-y-0">
          {stats.map((stat) => (
            <Reveal key={stat.label} delay={0.1}>
              <div className="group bg-[#F7F7F5] p-8 transition-colors duration-500 hover:bg-[#F0EFEC] md:p-12">
                <p className="p-display-sm text-[#0F1C1A]">
                  <Counter value={stat.value} suffix={stat.suffix} duration={1.8} />
                </p>
                <p className="mt-4 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-[#737373]">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
