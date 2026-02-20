import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader } from '../../components/common/Card';
import { PublicFooter } from '../../components/public/PublicFooter';
import { PublicNavbar } from '../../components/public/PublicNavbar';

export function AdmissionsPage() {
  return (
    <div className="min-h-screen">
      <PublicNavbar />
      <div className="max-w-4xl mx-auto pt-28">
        {/* Hero */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Admissions</h1>
          <p className="text-lg text-gray-600">
            Join our vibrant community of learners and achievers
          </p>
        </div>

        {/* Welcome */}
        <Card className="mb-8">
          <CardBody>
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to Mavade School! We are committed to nurturing young minds and preparing students for success in an increasingly complex world. Our holistic approach to education combines academic excellence with character development.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Whether you're a prospective student or parent, we invite you to explore what makes our school special. From our dedicated teachers to our state-of-the-art facilities, everything is designed to support your educational journey.
            </p>
          </CardBody>
        </Card>

        {/* Programs */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6 ml-4">Our Programs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card hover>
            <CardHeader title="Junior Secondary School" />
            <CardBody>
              <p className="text-gray-600 text-sm mb-4">
                Specialized curriculum with subject choices and preparation for higher education.
              </p>
              <p className="text-sm text-primary-600 font-semibold">JSS 1-3</p>
            </CardBody>
          </Card>

          <Card hover>
            <CardHeader title="Senior Secondary School" />
            <CardBody>
              <p className="text-gray-600 text-sm mb-4">
                Advanced academics with college preparation and career guidance programs.
              </p>
              <p className="text-sm text-primary-600 font-semibold">SSS 1-3</p>
            </CardBody>
          </Card>
        </div>

        {/* Admission Process */}
        <Card className="mb-8">
          <CardHeader title="Admission Process" />
          <CardBody>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-600 text-white font-bold text-sm">
                    1
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Application</h4>
                  <p className="text-gray-600 mt-1">
                    Submit the admission form online or in person with required documents
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-600 text-white font-bold text-sm">
                    2
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Entrance Test</h4>
                  <p className="text-gray-600 mt-1">
                    Take our standardized entrance examination to assess your academic level
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-600 text-white font-bold text-sm">
                    3
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Interview</h4>
                  <p className="text-gray-600 mt-1">
                    Meet with our admission counselor to discuss your educational goals
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-600 text-white font-bold text-sm">
                    4
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Offer Letter</h4>
                  <p className="text-gray-600 mt-1">
                    Receive your admission offer along with fee structure details
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-600 text-white font-bold text-sm">
                    5
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Enrollment</h4>
                  <p className="text-gray-600 mt-1">
                    Complete enrollment formalities and begin your journey with us
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Contact Section */}
        <Card className="bg-primary-50 border-primary-200 mb-12">
          <CardBody className="text-center">
            <h3 className="text-lg font-semibold text-primary-900 mb-4">
              Ready to Apply?
            </h3>
            <p className="text-primary-800 mb-6">
              Contact our Admissions office for more information and to schedule a campus tour.
            </p>
            <Link
              to="/contact"
              className="inline-block px-6 py-2 bg-primary-600 text-black rounded-lg hover:bg-primary-700 transition-colors border border-black border-solid"
            >
              Contact Admissions
            </Link>
          </CardBody>
        </Card>
      </div>
      <PublicFooter />
    </div>
  );
}
