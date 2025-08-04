import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/HomePage.module.css';

// Statistics data - 基于墨计官网数据
const statsData = [
  { number: '100+', label: '头部建企优选' },
  { number: '2000+', label: '成功落地项目' },
  { number: '5', label: '沉淀优质班组', suffix: '万个+' },
  { number: '50', label: '沉淀优质产业工人', suffix: '万人+' }
];

// Partner data - 基于墨计官网合作案例
const partnerData = [
  {
    category: '装饰',
    name: '深装集团',
    period: '2022年～至今',
    challenges: ['劳务费付超', '存在劳资纠纷风险', '劳务管理成本高'],
    achievements: [
      { metric: '100%', description: '电子合同签约率' },
      { metric: '50%', description: '人力成本节约' }
    ]
  },
  {
    category: '幕墙',
    name: '江河集团',
    period: '2021年～至今',
    challenges: ['工资支付监管难', '支付工作费时费力易出错'],
    achievements: [
      { metric: '100%', description: '劳务费资金监管' },
      { metric: '15倍', description: '工资支付效率提升' }
    ]
  },
  {
    category: '基建',
    name: '中建三局基础设施建设投资有限公司',
    period: '2020年～至今',
    challenges: ['开放式工程管理难', '工人安全意识薄弱', '工资代发效率低'],
    achievements: [
      { metric: '100%', description: '电子合同签约率' },
      { metric: '332506小时', description: '工人教育累计学习' }
    ]
  },
  {
    category: '安装',
    name: '中建三局数字工程有限公司',
    period: '2020年～至今',
    challenges: ['劳务规范化管理成本高效率低', '工人工资发放进度把控难'],
    achievements: [
      { metric: '8倍', description: '劳务管理效率提升' },
      { metric: '100%', description: '工资单在线确认' }
    ]
  },
  {
    category: '铁路',
    name: '中建铁路投资建设集团',
    period: '2020年～至今',
    challenges: ['线性工程考勤难', '实名制合规管理成本高'],
    achievements: [
      { metric: '100%', description: '实名制数据对接率' },
      { metric: '80%', description: '劳务管理成本降低' }
    ]
  }
];

// Animated counter component
const AnimatedCounter: React.FC<{ end: number; duration?: number; suffix?: string }> = ({ 
  end, 
  duration = 2000, 
  suffix = '' 
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const animateCount = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    };
    
    const timeoutId = setTimeout(() => {
      requestAnimationFrame(animateCount);
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [end, duration]);

  return <span>{count}{suffix}</span>;
};

const HomePage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <Head>
        <title>墨计 - 建筑劳务一站式服务平台</title>
        <meta name="description" content="墨计 - 品质用工推动者，满足建筑劳务管理、培训、招聘一站式数字化服务" />
        <meta name="keywords" content="建筑劳务,劳务管理,实名制,工人培训,劳务招聘,数字化服务,墨计星盘" />
        <meta name="author" content="墨计" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="墨计 - 建筑劳务一站式服务平台" />
        <meta property="og:description" content="品质用工推动者，满足建筑劳务管理、培训、招聘一站式数字化服务" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.emodor.com/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="墨计 - 建筑劳务一站式服务平台" />
        <meta name="twitter:description" content="品质用工推动者，满足建筑劳务管理、培训、招聘一站式数字化服务" />
        <link rel="canonical" href="https://www.emodor.com/" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.container}>
        {/* Navigation Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.logo}>
              <h1>墨计</h1>
            </div>
            <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
              <Link href="#home" className={styles.navLink}>首页</Link>
              <Link href="#services" className={styles.navLink}>服务总览</Link>
              <Link href="#partners" className={styles.navLink}>成功案例</Link>
              <Link href="#solution" className={styles.navLink}>实名制+解决方案</Link>
              <Link href="#about" className={styles.navLink}>关于我们</Link>
              <Link href="#contact" className={styles.navLink}>联系我们</Link>
              <button className={styles.trialBtn}>立即体验</button>
            </nav>
            <button 
              className={styles.menuBtn}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              ☰
            </button>
          </div>
        </header>

        {/* Hero Banner */}
        <section id="home" className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.heroLeft}>
              <h1 className={styles.heroTitle}>品质用工推动者</h1>
              <div className={styles.heroSubtitle}>
                <p>• 满足建筑劳务管理、培训、招聘一站式数字化服务</p>
                <p>• 从源头规避劳务纠纷</p>
                <p>• 实时、多维的工人数据洞察</p>
                <p>• 沉淀自有产业工人队伍</p>
              </div>
              <button className={styles.heroBtn}>立即体验</button>
            </div>
            <div className={styles.heroRight}>
              <div className={styles.heroImage}>
                <div className={styles.heroImagePlaceholder}>
                  <span>墨计星盘</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className={styles.stats}>
          <div className={styles.statsContent}>
            <h2 className={styles.statsTitle}>他们都选择了先进的劳务管理方式</h2>
            <div className={styles.statsGrid}>
              {statsData.map((stat, index) => {
                const numericValue = parseInt(stat.number.replace(/[^0-9]/g, '')) || 0;
                const displaySuffix = stat.suffix || (stat.number.includes('+') ? '+' : '');
                
                return (
                  <div key={index} className={styles.statItem}>
                    <div className={styles.statNumber}>
                      <AnimatedCounter 
                        end={numericValue} 
                        suffix={displaySuffix}
                      />
                    </div>
                    <div className={styles.statLabel}>{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Service Architecture */}
        <section id="services" className={styles.services}>
          <div className={styles.servicesContent}>
            <h2 className={styles.sectionTitle}>服务总览</h2>
            <p className={styles.serviceSubtitle}>点击查看实名制+解决方案</p>
            <div className={styles.architectureDiagram}>
              <div className={styles.diagramPlaceholder}>
                <span>建筑劳务一站式服务架构</span>
                <p>从实名制登记到劳务管理，全链路数字化服务</p>
              </div>
            </div>
          </div>
        </section>

        {/* Partners Showcase */}
        <section id="partners" className={styles.partners}>
          <div className={styles.partnersContent}>
            {partnerData.map((partner, index) => (
              <div key={index} className={styles.partnerCard}>
                <div className={styles.partnerHeader}>
                  <span className={styles.partnerCategory}>{partner.category}</span>
                  <h3 className={styles.partnerName}>{partner.name}</h3>
                  <p className={styles.partnerPeriod}>合作时间：{partner.period}</p>
                </div>
                <div className={styles.partnerBody}>
                  <div className={styles.partnerChallenges}>
                    {partner.challenges.map((challenge, idx) => (
                      <p key={idx} className={styles.challenge}>• {challenge}</p>
                    ))}
                  </div>
                  <div className={styles.partnerAchievements}>
                    {partner.achievements.map((achievement, idx) => (
                      <div key={idx} className={styles.achievement}>
                        <span className={styles.achievementMetric}>{achievement.metric}</span>
                        <span className={styles.achievementDesc}>{achievement.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trial Section */}
        <section id="contact" className={styles.trial}>
          <div className={styles.trialContent}>
            <h2 className={styles.trialTitle}>免费体验，先进的劳务管理方式</h2>
            <p className={styles.trialSubtitle}>专属顾问会在1个工作日内与您联系，安排试用</p>
            <form className={styles.trialForm}>
              <div className={styles.formGroup}>
                <input type="text" placeholder="公司名称" className={styles.formInput} />
                <input type="text" placeholder="您的称呼" className={styles.formInput} />
              </div>
              <div className={styles.formGroup}>
                <input type="tel" placeholder="手机号码" className={styles.formInput} />
                <input type="text" placeholder="手机验证码" className={styles.formInput} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>您的困难，我们来解决（可多选）：</label>
                <div className={styles.checkboxGroup}>
                  {[
                    '日常考勤管理难', '监管平台对接难', '劳务纠纷举证难', '劳务费付超',
                    '工人恶意讨薪', '施工安全管理难', '优质班组/工人筛选难', '建筑工地招工难'
                  ].map((option, index) => (
                    <label key={index} className={styles.checkboxLabel}>
                      <input type="checkbox" className={styles.checkbox} />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
              <button type="submit" className={styles.submitBtn}>提交申请</button>
            </form>
          </div>
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <p>&copy; 2024 墨计. All rights reserved. | 建筑劳务一站式服务平台</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;