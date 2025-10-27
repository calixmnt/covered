import { Link } from 'react-router-dom';
import { FaShieldAlt } from 'react-icons/fa';
import '../styles/footer.css';

export function Footer() {
    return (
        <footer className="footer-discrete">
            <div className="footer-discrete__container">
                <p className="footer-discrete__text">
                    Made with ♥ by{' '}
                    <a 
                        href="https://lavibeagency.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="footer-discrete__link"
                    >
                        laVibe Agency
                    </a>
                </p>
                
                <Link to="/privacy" className="footer-discrete__privacy">
                    <FaShieldAlt />
                    <span>Privacy</span>
                </Link>
            </div>
        </footer>
    );
}
