import { motion } from 'framer-motion';
import Button from '../../components/common/Button';
import { Card, CardBody } from '../../components/common/Card';
import { PublicFooter } from '../../components/public/PublicFooter';
import { PublicNavbar } from '../../components/public/PublicNavbar';
import hero from '../../assets/desk-hero.jpg';
import personalizedLearningImage from '../../assets/section2.jpg';

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <PublicNavbar isLandingPage />

      {/* Hero Section */}
      <section className="mt-24 bg-[#f4f4f5] w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-[350px] lg:h-[500px]">
          {/* LEFT: TEXT */}
          <div className="flex items-center">
            <div className="max-w-7xl mx-auto px-12 py-4 lg:py-6 lg:ml-12">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-[#18181b] mb-8">
                Shaping Confident Minds for a Changing World
              </h1>
              <p className="text-lg sm:text-xl text-[#52525b] max-w-xl">
                We are a private secondary school committed to academic excellence,
                character development, and personalized learning.
              </p>
            </div>
          </div>
          {/* RIGHT: IMAGE */}
          <div className="hidden lg:block w-full h-full overflow-hidden">
            <img
              src={hero}
              alt="hero image"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>



      {/* Why Us Section */}
      <section id="why-us" style={{ paddingTop: '5rem', paddingBottom: '5rem', display: 'flex', justifyContent: 'center', width: '100%', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1280px', width: '100%', padding: '0 1rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-[#09090b] mb-4">Why Choose Mavade?</h2>
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card hover className="h-full">
                  <CardBody className="text-center">
                    <div className="text-4xl mb-4">{item.icon}</div>
                    <h3 className="text-lg font-semibold text-[#09090b] mb-2">{item.title}</h3>
                    <p className="text-[#3f3f46]">{item.description}</p>
                  </CardBody>
                </Card>
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
      <section id="request-info" style={{ paddingTop: '5rem', paddingBottom: '5rem', display: 'flex', justifyContent: 'center', width: '100%', backgroundColor: '#ececec' }}>
        <div style={{ maxWidth: '768px', width: '100%', padding: '0 1rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Get More Information</h2>
            <p className="text-xl text-gray-600">Interested in learning more? Request a demo today.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardBody>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      School Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Your school name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows={5}
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
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
      </section>

      <PublicFooter showLandingAnchors />
    </div>
  );
}
