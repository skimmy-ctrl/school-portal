import { Card, CardBody, CardHeader } from '../../components/common/Card';
import { PublicFooter } from '../../components/public/PublicFooter';
import { PublicNavbar } from '../../components/public/PublicNavbar';
import about1 from '../../assets/about1.jpg';
import about2 from '../../assets/about2.jpg';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-white to-slate-50">
      <PublicNavbar />
      <div className="pt-28">
        {/* Hero */}
        <div className="max-w-4xl mx-auto mb-12 text-center px-6 py-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">About Mavade Portal</h1>
          <p className="text-lg text-slate-600">
            Transforming education through modern technology and innovation
          </p>
        </div>

        {/* Mission */}
        <section className="mt-24 w-full mb-12 bg-slate-100/80">
          <div className="grid grid-cols-1 lg:grid-cols-2 h-[400px] bg-white/90 overflow-hidden shadow-sm">
            <div className="hidden lg:block w-full h-full overflow-hidden">
              <img
                src={about1}
                alt="Our Vision"
                className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
              />
            </div>
            <div className='flex items-center'>
              <div className='max-w-7xl mx-auto px-8 sm:px-12 py-8 lg:py-10 lg:ml-12'>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-slate-900 mb-8 tracking-tight">
                  Our Mission
                </h2>
                <p className="text-lg sm:text-xl text-slate-700 max-w-xl">
                  At Mavade College, our mission is to provide a supportive and innovative learning environment that nurtures academic excellence, character development, and lifelong learning. We are committed to empowering students with the knowledge, skills, and values they need to succeed in a rapidly changing world while making meaningful contributions to society.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Vision */}
        <section className="mb-12 mt-24 bg-sky-50/80">
          <div className="grid grid-cols-1 lg:grid-cols-2 bg-white/90 overflow-hidden shadow-sm">
            <div className="flex items-center">
              <div className="max-w-7xl mx-auto px-8 sm:px-12 py-8 lg:py-10 lg:ml-12">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-slate-900 mb-8 tracking-tight">
                  Our Vision
                </h2>
                <p className="text-lg sm:text-xl text-slate-700 max-w-xl">
                  Our vision is to be a leading institution recognized for educational excellence, integrity, and innovation. We aim to shape confident, responsible, and forward-thinking individuals who are prepared to lead, inspire, and positively impact their communities both locally and globally.
                </p>
              </div>
            </div>
            <div className="w-full h-full overflow-hidden">
              <img
                src={about2}
                alt="Our Vision"
                className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
              />
            </div>           
          </div>
        </section>

        {/* Key Features */}
        <Card className="max-w-4xl mx-auto mb-8 border border-slate-200/70 shadow-sm bg-white/80 backdrop-blur">
          <CardHeader title="Why Choose Mavade College?" />
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Quality Education</h4>
                <p className="text-slate-600">
                  We deliver a well-structured curriculum taught by dedicated and experienced educators.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Student-centered Learning</h4>
                <p className="text-slate-600">
                  Every student is supported to reach their full academic and personal potential.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Strong Value & Discipline</h4>
                <p className="text-slate-600">
                  We emphasize integrity, respect, and responsibility in all aspects of school.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Modern Learning Environment</h4>
                <p className="text-slate-600">
                  Our facilities and teaching methods are designed to encourage creativity and critical thinking.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Holistic Development</h4>
                <p className="text-slate-600">
                  Beyond academics, we focus on leadership, confidence, and real-world skills.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Contact CTA */}
        <Card className="max-w-4xl mx-auto bg-gradient-to-br from-primary-50 to-white border-primary-200 mb-12 shadow-sm">
          <CardBody className="text-center">
            <h3 className="text-lg font-semibold text-primary-900 mb-2">Have Questions?</h3>
            <p className="text-primary-800 mb-4">
              Contact our support team for more information about implementing Mavade Portal in your school.
            </p>
            <a
              href="/contact"
              className="inline-block px-6 py-2 bg-primary-600 text-black rounded-lg border border-black transition-all duration-300 ease-out hover:bg-primary-700 hover:shadow-md hover:-translate-y-0.5"
            >
              Get in Touch
            </a>
          </CardBody>
        </Card>
      </div>
      <PublicFooter />
    </div>
  );
}
