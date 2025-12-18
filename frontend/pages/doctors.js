// pages/doctors.js
import { useState } from 'react'
import Head from 'next/head'

const DATA = {
  Mumbai: {
    Nephrologists: [
      { name: 'Dr. Bhupendra Gandhi', hospital: 'Jaslok Hospital' },
      { name: 'Dr. Umesh Khanna', hospital: 'Lancelot Kidney & GI Centre' },
      { name: 'Dr. Suresh Sankhla', hospital: 'Bombay Hospital' },
      { name: 'Dr. Bharat Shah', hospital: 'Global Hospitals' },
      { name: 'Dr. Anil Patki', hospital: 'Lilavati Hospital' },
    ],
    Diabetologists: [
      { name: 'Dr. Shardul K. Kothary', hospital: 'Advanced Diabetes Care Centre, Fort' },
      { name: 'Dr. Ami Sanghvi', hospital: 'Sanghvi Eye & Diabetes Care Centre, Dahisar East' },
      { name: 'Dr. Nitin Patankar', hospital: 'Wisdom Clinic, Mulund West' },
      { name: 'Dr. Mihir Raut', hospital: '[Details not specified]' },
      { name: 'Dr. Suresh Damodaran', hospital: '[Details not specified]' },
    ],
    'General Medicine': [
      { name: 'Dr. Hemant Thacker', hospital: 'Breach Candy Hospital' },
      { name: 'Dr. Ramesh Bharmal', hospital: 'Sir JJ Hospital' },
      { name: 'Dr. Pradeep Gadge', hospital: 'Gadge Diabetes Centre' },
      { name: 'Dr. Sanjay Agarwala', hospital: 'P.D. Hinduja Hospital' },
      { name: 'Dr. Ramesh Mehta', hospital: '[Details not specified]' },
    ],
  },
  Delhi: {
    Nephrologists: [
      { name: 'Dr. S.K. Agarwal', hospital: 'AIIMS' },
      { name: 'Dr. Dinesh Khullar', hospital: 'Max Super Speciality Hospital' },
      { name: 'Dr. Vinant Bhargava', hospital: 'Medanta – The Medicity' },
      { name: 'Dr. Sanjiv Saxena', hospital: 'Indraprastha Apollo Hospital' },
      { name: 'Dr. Anil Kumar Bhalla', hospital: 'Sir Ganga Ram Hospital' },
    ],
    Diabetologists: [
      { name: 'Dr. Deepak Khandelwal', hospital: 'Max Super Speciality Hospital, Paschim Vihar' },
      { name: 'Dr. Amitabh Khanna', hospital: 'Diabetes Speciality Center, Dwarka' },
      { name: 'Dr. Sujit Jha', hospital: 'Max Super Speciality Hospital, Saket' },
      { name: 'Dr. Ambrish Mithal', hospital: 'Medanta Hospital, Gurgaon' },
      { name: 'Dr. B.K. Roy', hospital: 'Apollo Hospital, Delhi' },
    ],
    'General Medicine': [
      { name: 'Dr. S.K. Sharma', hospital: 'AIIMS' },
      { name: 'Dr. Rajeev Gupta', hospital: 'Sir Ganga Ram Hospital' },
      { name: 'Dr. Ashok Seth', hospital: 'Fortis Escorts Heart Institute' },
      { name: 'Dr. Anoop Misra', hospital: 'Fortis C-DOC Hospital' },
      { name: 'Dr. Randeep Guleria', hospital: 'AIIMS' },
    ],
  },
  Bengaluru: {
    Nephrologists: [
      { name: 'Dr. H. Sudarshan Ballal', hospital: 'Manipal Hospitals' },
      { name: 'Dr. Sreedhara C.M.', hospital: 'Apollo Hospitals' },
      { name: 'Dr. V. Narayan Prasad', hospital: 'Fortis Hospital' },
      { name: 'Dr. Rajeev Annigeri', hospital: 'Columbia Asia Hospital' },
      { name: 'Dr. S. Sunder', hospital: 'St. John’s Medical College Hospital' },
    ],
    Diabetologists: [
      { name: 'Dr. Pradeep G. Talwalkar', hospital: '[Details not specified]' },
      { name: 'Dr. Shashank Joshi', hospital: '[Details not specified]' },
      { name: 'Dr. Anil Kumar', hospital: '[Details not specified]' },
      { name: 'Dr. Suresh Damodaran', hospital: '[Details not specified]' },
      { name: 'Dr. Ramesh Goyal', hospital: '[Details not specified]' },
    ],
    'General Medicine': [
      { name: 'Dr. B. Ramamurthy', hospital: 'Manipal Hospitals' },
      { name: 'Dr. Anil Kumar', hospital: 'Apollo Hospitals' },
      { name: 'Dr. K.N. Srinivasa', hospital: 'Fortis Hospital' },
      { name: 'Dr. M.A. Aleem', hospital: '[Details not specified]' },
      { name: 'Dr. V. Mohan', hospital: '[Details not specified]' },
    ],
  },
  Chennai: {
    Nephrologists: [
      { name: 'Dr. Georgi Abraham', hospital: 'Madras Medical Mission' },
      { name: 'Dr. M. Soundararajan', hospital: 'Apollo Hospitals' },
      { name: 'Dr. S. Rajagopalan', hospital: 'Fortis Malar Hospital' },
      { name: 'Dr. R. Balasubramaniyam', hospital: 'MIOT International' },
      { name: 'Dr. R. Vijayakumar', hospital: 'SIMS Hospital' },
    ],
    Diabetologists: [
      { name: 'Dr. V. Mohan', hospital: "Dr. Mohan's Diabetes Specialities Centre" },
      { name: 'Dr. Veeraswamy Seshiah', hospital: '[Details not specified]' },
      { name: 'Dr. Vijay Viswanathan', hospital: 'M.V. Hospital for Diabetes' },
      { name: 'Dr. Kavitha G', hospital: 'Nannalam Clinic, Anna Nagar' },
      { name: 'Dr. Anbazhahan Rajaram', hospital: 'Apollo Medical Center, Anna Nagar' },
    ],
    'General Medicine': [
      { name: 'Dr. S. Thanikachalam', hospital: 'Sri Ramachandra Medical Centre' },
      { name: 'Dr. S. Ramesh', hospital: 'Apollo Hospitals' },
      { name: 'Dr. V. Balaji', hospital: 'Fortis Malar Hospital' },
      { name: 'Dr. R. Narayanan', hospital: 'MIOT International' },
      { name: 'Dr. K. Srinivasan', hospital: 'SIMS Hospital' },
    ],
  },
  Kolkata: {
    Nephrologists: [
      { name: 'Dr. Abhishek Mukherji', hospital: 'IRIS Hospital, Baghajatin' },
      { name: 'Dr. Md. Mohsin', hospital: 'Apollo Gleneagles Hospitals, Salt Lake' },
      { name: 'Dr. Arup Dutta', hospital: 'Calcutta Medical Centre, Circus Avenue' },
      { name: 'Dr. Abhijit Taraphder', hospital: 'Apollo Gleneagles Hospitals, Salt Lake' },
      { name: 'Dr. Suchandro Das', hospital: 'Fortis Hospital and Kidney Institute, Rash Behari Avenue' },
    ],
    Diabetologists: [
      { name: 'Dr. Ghanshyam Goyal', hospital: 'ILS Hospitals, Salt Lake' },
      { name: 'Dr. Rishad Ahmed', hospital: 'Manipal Hospitals (AMRI Hospitals), Mukundapur' },
      { name: 'Dr. S.A. Mallick', hospital: "Dr. Amitava Chakravorty's Clinic, Lake Gardens" },
      { name: 'Dr. Shyama Prasad Roy', hospital: "Binapani Doctor's Chamber, Jadavpur" },
      { name: 'Dr. Sandip Rungta', hospital: 'Mansa Sheel, Beadon Street' },
    ],
    'General Medicine': [
      { name: 'Dr. S.K. Sharma', hospital: '[Details not specified]' },
      { name: 'Dr. Rajeev Gupta', hospital: '[Details not specified]' },
      { name: 'Dr. Ashok Seth', hospital: '[Details not specified]' },
      { name: 'Dr. Anoop Misra', hospital: '[Details not specified]' },
      { name: 'Dr. Randeep Guleria', hospital: '[Details not specified]' },
    ],
  },
}

export default function DoctorsPage() {
  const cities        = Object.keys(DATA)
  const specialties  = ['Nephrologists', 'Diabetologists', 'General Medicine']
  const [city, setCity]             = useState(cities[0])
  const [specialty, setSpecialty]   = useState(specialties[0])

  return (
    <>
      <Head>
        <title>Doctors List</title>
      </Head>

      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Doctor’s List</h2>

        {/* City Tabs */}
        <div className="flex space-x-4 mb-6">
          {cities.map(c => (
            <button
              key={c}
              onClick={() => setCity(c)}
              className={`px-4 py-2 rounded ${
                city === c
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🏥 {c}
            </button>
          ))}
        </div>

        {/* Specialty Filters */}
        <div className="flex space-x-4 mb-8">
          {specialties.map(s => (
            <button
              key={s}
              onClick={() => setSpecialty(s)}
              className={`px-4 py-2 rounded ${
                specialty === s
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Doctor Cards */}
        <div className="grid gap-6">
          {DATA[city][specialty].map((doc, i) => (
            <div
              key={i}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold">{doc.name}</h3>
              <p className="text-gray-600">{doc.hospital}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
