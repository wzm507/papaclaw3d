'use client'

import PReveal from '../components/PReveal'
import PAnimatedText from '../components/PAnimatedText'
import PCounter from '../components/PCounter'

export default function PAbout() {
  const stats = [
    { value: 14, suffix: '年', label: '中东深耕经验' },
    { value: 3, suffix: '亿', prefix: '¥', label: '9 个月协助客户成交' },
    { value: 6, suffix: '人', label: '精干团队 · 低成本运营' },
  ]

  return (
    <section id="about" className="p-section border-t border-[#E5E5E0] bg-[#F7F7F5] py-24 md:py-32">
      <div className="p-inner">
        <div className="mb-20 grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <PReveal>
              <p className="p-kicker mb-6">Positioning</p>
            </PReveal>
            <PAnimatedText as="h2" className="p-heading-xl">
              出海不是先组队，是先拿到第一张订单。
            </PAnimatedText>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <PReveal delay={0.2}>
              <p className="p-body-lg">
                我们这支队伍在海外待了 14 年，中东的坑踩过，楼卖过，十几亿的盘也操过。现在把这些经验和人脉搬回了南沙。
              </p>
              <p className="p-body-lg mt-6">
                别人出海是摸着石头过河，我们是直接开直升机过去。办公室不大，人不堆，排场不撑，钱全花在帮客户拿订单这件事上。
              </p>
            </PReveal>
          </div>
        </div>

        <div className="p-rule mb-0" />
        <div className="grid divide-y divide-[#E5E5E0] md:grid-cols-3 md:divide-x md:divide-y-0">
          {stats.map((stat) => (
            <PReveal key={stat.label} delay={0.1}>
              <div className="group bg-[#F7F7F5] p-8 transition-colors duration-500 hover:bg-[#F0EFEC] md:p-12">
                <p className="p-display-sm text-[#0F1C1A]">
                  <PCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} duration={1.8} />
                </p>
                <p className="mt-4 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-[#737373]">{stat.label}</p>
              </div>
            </PReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
