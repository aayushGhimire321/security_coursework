import dompurify from 'dompurify';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { contactUsApi, getSingleProfileApi } from '../../apis/Api';
import './ContactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    const sanitizedValue = dompurify.sanitize(e.target.value);
    setFormData({ ...formData, [e.target.name]: sanitizedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await contactUsApi(formData);
      if (response.data.success) {
        toast.success(response.data.message);
        // Reset form after successful submission
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error submitting the form:', error);
      toast.error('Failed to send the message. Please try again later.');
    }
  };

  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);

    getSingleProfileApi()
      .then((res) => {
        // console.log('API response:', res.data);
        const { username, email } = res.data.user;
        setFormData({ ...formData, name: username, email });
      })
      .catch((error) => {
        // console.log(error);
      });
  }, []);

  return (
    <div className='contact-us my-5'>
      <h1>Contact Us</h1>
      <div className='contact-container'>
        <div className='contact-form'>
          <h2>Send us a feedback</h2>
          <form onSubmit={handleSubmit}>
            <input
              type='text'
              name='name'
              placeholder='Your Name'
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type='email'
              name='email'
              placeholder='Your Email'
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type='text'
              name='subject'
              placeholder='Subject'
              value={formData.subject}
              onChange={handleChange}
              required
            />
            <textarea
              name='message'
              placeholder='Your Message'
              value={formData.message}
              onChange={handleChange}
              required></textarea>
            <button type='submit'>Send Message</button>
          </form>
        </div>
        <div className='contact-info'>
          <h2>Contact Information</h2>
          <p>
            <i className='fas fa-map-marker-alt'></i> 123 Movie Street, Cinema
            City, 12345
          </p>
          <p>
            <i className='fas fa-phone'></i> +1 (555) 123-4567
          </p>
          <p>
            <i className='fas fa-envelope'></i> contact@FilmSathi .com
          </p>

          <div className='social-media'>
            <a
              href='#'
              className='fab fa-facebook'></a>
            <a
              href='#'
              className='fab fa-twitter'></a>
            <a
              href='#'
              className='fab fa-instagram'></a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
