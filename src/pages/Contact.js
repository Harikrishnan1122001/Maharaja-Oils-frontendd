import { useState } from "react";
import { contactApi } from "../api/endpoints";

const initialForm = { name: "", email: "", phone: "", subject: "", message: "" };

const Contact = () => {
  const [form, setForm] = useState(initialForm);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError("");
    setSuccess(false);
    try {
      await contactApi.send(form);
      setSuccess(true);
      setForm(initialForm);
    } catch (err) {
      setError(err.response?.data?.message || "Could not send your message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container" style={{ padding: "50px 20px 70px", maxWidth: 640 }}>
      <p className="eyebrow">We'd Love to Hear From You</p>
      <h1>Contact Us</h1>

      <div className="card" style={{ padding: 26, marginTop: 20 }}>
        <p><b>Phone:</b> +91 73733 22866</p>
        <p><b>Email:</b> maharajaoilmill@gmail.com</p>
        <p style={{ marginBottom: 0 }}><b>Address:</b> Sangam Thidal, Near Ayyanar Kovil, Karaikudi - 630003</p>
      </div>

      <div className="card" style={{ padding: 26, marginTop: 20 }}>
        <h3 style={{ marginBottom: 16 }}>Send us a message</h3>

        {success && (
          <div className="form-success-banner">
            🎉 Thanks for reaching out! We've received your message and will get back to you shortly.
          </div>
        )}
        {error && <div className="form-error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="contact-name">Name</label>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
            />
          </div>

          <div className="field">
            <label htmlFor="contact-email">Email</label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </div>

          <div className="field">
            <label htmlFor="contact-phone">Phone (optional)</label>
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="+91 XXXXX XXXXX"
            />
          </div>

          <div className="field">
            <label htmlFor="contact-subject">Subject (optional)</label>
            <input
              id="contact-subject"
              name="subject"
              type="text"
              value={form.subject}
              onChange={handleChange}
              placeholder="What is this about?"
            />
          </div>

          <div className="field">
            <label htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={5}
              value={form.message}
              onChange={handleChange}
              placeholder="How can we help?"
            />
          </div>

          <button type="submit" disabled={sending} className="btn btn-primary btn-block">
            {sending ? "Sending…" : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
