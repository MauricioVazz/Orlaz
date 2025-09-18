import styles from './Point.module.css'
import HeaderBlue from '../../components/HeaderBlue';
import ContentPage from '../../components/ContentPage';
import Comments from '../../components/Comments';
import Footer from '@/components/Footer';

export default function Point() {
    return (
        <div>
            <HeaderBlue />
            <ContentPage />
            <Comments />
            <Footer />
        </div>
    )
}