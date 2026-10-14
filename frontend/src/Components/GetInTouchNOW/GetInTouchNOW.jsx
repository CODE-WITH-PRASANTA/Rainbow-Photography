import React, { useEffect, useMemo, useState } from "react";
import "./GetInTouchNOW.css";

const GetInTouchNOW = () => {
  // ✅ component base class name
  const base = "get-in-touch";

  const [animate, setAnimate] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    subject: "",
    category: "event",
    message: "",
    location: "",
  });

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 80);
    return () => clearTimeout(t);
  }, []);

  const partyImg = useMemo(
    () =>
      "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1400&q=80",
    []
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("GetInTouchNOW Form:", form);
  };

  return (
    <section className={`${base} ${animate ? `${base}--in` : ""}`}>
      <div className={`${base}__wrap`}>
        {/* LEFT IMAGE CARD */}
        <div className={`${base}__left`}>
          <div className={`${base}__imgCard`}>
            <img className={`${base}__img`} src={partyImg} alt="Party" />
            <div className={`${base}__imgShade`} />
          </div>
        </div>

        {/* RIGHT FORM CARD */}
        <div className={`${base}__right`}>
          <form className={`${base}__card`} onSubmit={handleSubmit}>
            <h2 className={`${base}__title`}>GET IN TOUCH NOW</h2>

            <div className={`${base}__grid`}>
              <div className={`${base}__field`}>
                <input
                  className={`${base}__input`}
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Name"
                  autoComplete="name"
                />
              </div>

              <div className={`${base}__field`}>
                <input
                  className={`${base}__input`}
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  autoComplete="tel"
                />
              </div>

              <div className={`${base}__field ${base}__field--full`}>
                <input
                  className={`${base}__input`}
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  autoComplete="email"
                />
              </div>

              <div className={`${base}__field ${base}__field--full`}>
                <input
                  className={`${base}__input`}
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Address"
                  autoComplete="street-address"
                />
              </div>

              <div className={`${base}__field ${base}__field--full`}>
                <input
                  className={`${base}__input`}
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                />
              </div>

              <div className={`${base}__field ${base}__field--full`}>
                <div className={`${base}__selectWrap`}>
                  <select
                    className={`${base}__select`}
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                  >
                    <option value="event">Event</option>
                    <option value="marriage">Marriage</option>
                    <option value="photography">Photography</option>
                    <option value="caterings">Caterings</option>
                    <option value="bridal_makeup">Bridal Makeup</option>
                    <option value="other">Other</option>
                  </select>
                  <span className={`${base}__selectCaret`}>▾</span>
                </div>
              </div>

              <div className={`${base}__field ${base}__field--full`}>
                <textarea
                  className={`${base}__textarea`}
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Message"
                  rows={4}
                />
              </div>

              <div className={`${base}__field ${base}__field--full`}>
                <input
                  className={`${base}__input`}
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Location"
                />
              </div>
            </div>

            <div className={`${base}__actions`}>
              <button className={`${base}__btn`} type="submit">
                SUBMIT NOW
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default GetInTouchNOW;