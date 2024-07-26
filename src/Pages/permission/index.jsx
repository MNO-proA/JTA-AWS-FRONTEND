
import { Link } from "react-router-dom";
import notFound from '../../assets/not-found.svg'

const Permission = () => {
  return (
    <main>
    <div className="container">
      <section className="section error-404 min-vh-100 d-flex flex-column align-items-center justify-content-center">
        <h1>Access denied</h1>
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        <h2> Admin rights required.</h2>
        <Link className="btn" to="..">
          Back to home
        </Link>
        <img src={notFound} className="img-fluid py-5" alt="Page Not Found" />
        <div className="credits">
        </div>
      </section>
    </div>
  </main>
);
}

export default Permission