import { motion } from 'framer-motion';
import Button from '../../components/common/Button';
import { Card, CardBody } from '../../components/common/Card';
import { PublicFooter } from '../../components/public/PublicFooter';
import { PublicNavbar } from '../../components/public/PublicNavbar';
import { BackgroundPaperShaders } from '../../components/ui/background-paper-shaders';
import hero from '../../assets/desk-hero.jpg';
import personalizedLearningImage from '../../assets/section2.jpg';

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <PublicNavbar isLandingPage />

      {/* Hero Section */}
      <section className="mt-24 bg-[#f4f4f5] w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:h-[500px]">
          {/* LEFT: TEXT */}
          <div className="order-2 lg:order-1 flex items-center min-h-80 sm:min-h-96 lg:min-h-0 relative overflow-hidden">
            <BackgroundPaperShaders
              className="opacity-95"
              speed={2.6}
            />
            <div className="absolute inset-0 bg-white/22" />
            <div className="relative z-10 max-w-7xl mx-auto px-12 py-4 lg:py-6 lg:ml-12">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-[#18181b] mb-8">
                Shaping Confident Minds for a Changing World
              </h1>
              <p className="text-lg sm:text-xl text-[#3f3f46] max-w-xl">
                We are a private secondary school committed to academic excellence,
                character development, and personalized learning.
              </p>
            </div>
          </div>
          {/* RIGHT: IMAGE */}
          <div className="order-1 lg:order-2 w-full h-96 sm:h-[32rem] lg:h-full overflow-hidden">
            <img
              src={hero}
              alt="hero image"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>



      {/* Why Us Section */}
      <section id="why-us" className="w-full bg-white py-12 md:py-16 px-0 md:px-4">
        <div className="mx-auto w-full md:w-[92%] lg:w-[88%] max-w-6xl bg-[#0b1f3a] border border-[#133259] md:rounded-3xl shadow-[0_18px_45px_rgba(11,31,58,0.28)] px-4 sm:px-6 lg:px-8 py-16 md:py-20 min-h-[620px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose Mavade?</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '✓',
                title: 'Fully Accredited',
                description: 'Recognized and approved by educational authorities'
              },
              {
                icon: '📝',
                title: 'Daily Feedback',
                description: 'Regular communication with parents and guardians'
              },
              {
                icon: '⏰',
                title: 'Customize Schedule',
                description: 'Flexible learning programs tailored to students'
              },
              {
                icon: '👁️',
                title: 'Students Monitoring & Discipline',
                description: 'Comprehensive tracking and character development'
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 32, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: index * 0.08,
                  duration: 0.55,
                  ease: 'easeOut',
                }}
                viewport={{ once: true, amount: 0.25 }}
              >
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    boxShadow: [
                      '0 8px 18px rgba(2,12,27,0.10)',
                      '0 20px 34px rgba(2,12,27,0.24)',
                      '0 8px 18px rgba(2,12,27,0.10)',
                    ],
                  }}
                  transition={{
                    duration: 0.85,
                    ease: 'easeInOut',
                    delay: index * 0.85,
                    repeat: Infinity,
                    repeatDelay: 2.55,
                  }}
                >
                  <Card className="h-full min-h-[220px] sm:min-h-[240px] bg-white border-white/80">
                    <CardBody className="text-center h-full flex flex-col justify-center">
                      <div className="text-4xl mb-4">{item.icon}</div>
                      <h3 className="text-lg font-semibold text-[#09090b] mb-2">{item.title}</h3>
                      <p className="text-[#3f3f46]">{item.description}</p>
                    </CardBody>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Personalized Learning Section */}
      <section style={{ paddingTop: '5rem', paddingBottom: '5rem', display: 'flex', justifyContent: 'center', width: '100%', backgroundColor: 'white', border: '1px solid #e7e5e4' }}>
        <div style={{ maxWidth: '1280px', width: '100%', padding: '0 1rem' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image - Left on Desktop, Top on Mobile */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <img
                src={personalizedLearningImage}
                alt="Personalized learning"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </motion.div>

            {/* Text - Right on Desktop, Bottom on Mobile */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-4xl font-bold text-gray-900 mb-6">
                Private school, personalized learning
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                We offer a flexible and supportive learning experience for students seeking full-time education or additional academic guidance. Our personalized approach ensures every student receives the attention, structure, and encouragement needed to achieve academic excellence and personal growth.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Request Information Section */}
      <section
        id="request-info"
        className="relative w-full py-16 md:py-24 bg-[#f8fafc] overflow-hidden"
      >
        <div className="absolute -top-28 -left-16 h-72 w-72 rounded-full bg-[#c7d2fe]/35 blur-3xl" />
        <div className="absolute -bottom-20 right-0 h-80 w-80 rounded-full bg-[#bae6fd]/30 blur-3xl" />
        <div className="max-w-6xl mx-auto w-full px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="text-center mb-12 relative z-10"
          >
            <p className="text-xs tracking-[0.2em] uppercase text-[#64748b] mb-3">Admissions</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0f172a] mb-3">Request Information</h2>
            <p className="text-base sm:text-lg text-[#475569] max-w-2xl mx-auto">
              Tell us about your child and we will share admissions guidance, tuition details, and next steps.
            </p>
          </motion.div>

          <div className="relative z-10 rounded-[28px] border border-white/70 bg-white/70 backdrop-blur-md shadow-[0_20px_55px_rgba(15,23,42,0.10)] p-3 sm:p-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-stretch">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
                className="rounded-2xl bg-gradient-to-br from-[#0b1220] to-[#172033] text-white p-6 sm:p-8 shadow-[0_16px_35px_rgba(15,23,42,0.35)]"
            >
                <p className="text-xs uppercase tracking-[0.2em] text-white/70 mb-4">Why Parents Reach Out</p>
                <h3 className="text-2xl sm:text-3xl font-semibold leading-tight mb-6">
                Get a personalized admissions plan in under 24 hours.
              </h3>
                <div className="grid gap-3">
                  {[
                    'Admission requirements and entrance process by class level',
                    'Tuition overview, payment plans, and available support options',
                    'Curriculum details, extracurricular programs, and student support',
                  ].map((line) => (
                    <div key={line} className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white/90">
                      {line}
                    </div>
                  ))}
                </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              viewport={{ once: true }}
            >
                <Card className="rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_16px_35px_rgba(15,23,42,0.08)]">
                <CardBody className="p-6 sm:p-8">
                  <form className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                          <label className="block text-sm font-medium text-[#334155] mb-2">Parent/Guardian Name</label>
                        <input
                          type="text"
                            className="w-full px-4 py-3 border border-[#d7deea] rounded-xl bg-[#f8fafc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                          placeholder="Full name"
                        />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-[#334155] mb-2">Email Address</label>
                        <input
                          type="email"
                            className="w-full px-4 py-3 border border-[#d7deea] rounded-xl bg-[#f8fafc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                          <label className="block text-sm font-medium text-[#334155] mb-2">Phone Number</label>
                        <input
                          type="tel"
                            className="w-full px-4 py-3 border border-[#d7deea] rounded-xl bg-[#f8fafc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                          placeholder="+234 800 000 0000"
                        />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-[#334155] mb-2">Preferred Class</label>
                          <select className="w-full px-4 py-3 border border-[#d7deea] rounded-xl bg-[#f8fafc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]">
                          <option>JS1</option>
                          <option>JS2</option>
                          <option>JS3</option>
                          <option>SS1</option>
                          <option>SS2</option>
                          <option>SS3</option>
                        </select>
                      </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#334155] mb-2">What would you like to know?</label>
                      <textarea
                          className="w-full px-4 py-3 border border-[#d7deea] rounded-xl bg-[#f8fafc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                        rows={4}
                        placeholder="Share your questions about admissions, tuition, or school life."
                      />
                    </div>

                    <Button
                      variant="primary"
                      size="lg"
                        className="w-full !bg-gradient-to-r !from-[#2563eb] !to-[#1d4ed8] !text-white !border-0 shadow-[0_10px_22px_rgba(37,99,235,0.35)] hover:!from-[#1d4ed8] hover:!to-[#1e40af]"
                      onClick={(e) => {
                        e.preventDefault();
                        alert('Thank you for your interest! We will get back to you soon.');
                      }}
                    >
                      Send Request
                    </Button>
                  </form>
                </CardBody>
              </Card>
            </motion.div>
          </div>
          </div>
        </div>
      </section>

      <PublicFooter showLandingAnchors />
    </div>
  );
}
