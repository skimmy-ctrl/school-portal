import { useState } from 'react';
import { Card, CardBody, CardHeader } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { PublicFooter } from '../../components/public/PublicFooter';
import { PublicNavbar } from '../../components/public/PublicNavbar';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen">
      <PublicNavbar />
      <div className="max-w-6xl mx-auto pt-28">
        {/* Hero */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-lg text-gray-600">
            We'd love to hear from you. Reach out to us anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Contact Info Card */}
          <Card>
            <CardBody className="text-center">
              <div className="text-4xl mb-4">📧</div>
              <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">info@mavade.edu</p>
              <p className="text-gray-600">admissions@mavade.edu</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="text-center">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
              <p className="text-gray-600">(+234) 81-3273-6497</p>
              <p className="text-gray-600">Mon - Fri: 9 AM - 4 PM</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="text-center">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
              <p className="text-gray-600">Ayegun Apete</p>
              <p className="text-gray-600">Ibadan, Oyo State</p>
            </CardBody>
          </Card>
        </div>

        {/* Contact Form */}
        <Card className="max-w-2xl mx-auto mb-12">
          <CardHeader title="Send us a Message" subtitle="We'll get back to you as soon as possible" />
          <CardBody>
            {submitted ? (
              <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg text-center">
                <p className="font-semibold">Thank you for your message!</p>
                <p className="text-sm mt-1">We'll respond to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="text"
                    name="name"
                    label="Full Name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    type="email"
                    name="email"
                    label="Email Address"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="tel"
                    name="phone"
                    label="Phone Number"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select a subject</option>
                      <option value="admissions">Admissions Inquiry</option>
                      <option value="technical">Technical Support</option>
                      <option value="general">General Inquiry</option>
                      <option value="feedback">Feedback</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us more about your inquiry..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <Button type="submit" variant="primary" fullWidth>
                  Send Message
                </Button>
              </form>
            )}
          </CardBody>
        </Card>
      </div>
      <PublicFooter />
    </div>
  );
}
