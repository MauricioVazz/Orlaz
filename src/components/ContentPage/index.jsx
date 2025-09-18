
import styles from './ContentPage.module.css';
import { MdLocationOn, MdShare, MdFavorite } from 'react-icons/md';

export default function ContentPage({ name }) {
    return (
        <div>
            <div className={styles.title}>
                <h1 className={styles.tituloPrincipal}>{ name }Molhes do Porto Novo</h1>
            </div>
            <div className={styles.container}>
                <div className={styles.images}>
                    <img src="/images/atracao-barco.png" alt="Molhes do Porto Novo" className={styles.mainImage} />
                    <div className={styles.thumbsRow}>
                        <img src="/images/atracao-barco.png" alt="thumb1" className={styles.thumb} />
                        <img src="/images/atracao-barco.png" alt="thumb2" className={styles.thumb} />
                        <img src="/images/atracao-barco.png" alt="thumb3" className={styles.thumb} />
                        <img src="/images/atracao-barco.png" alt="thumb4" className={styles.thumb} />
                    </div>
                </div>
                <div className={styles.content}>
                    <div className={styles.actionsRow}>
                        <button className={styles.btnCidade}><MdLocationOn size={20} /> Caraguatatuba</button>
                        <button className={styles.btnCompartilhar}><MdShare size={20} /> Compartilhar</button>
                        <button className={styles.btnFavorito}><MdFavorite size={20} /> Favorito</button>
                    </div>
                    <p className={styles.descricao}>
                        Os Molhes do Porto Novo são estruturas de pedra, ou enrocamento, que formam a foz do Rio Juqueriquerê, em Caraguatatuba, São Paulo. Esta obra, que constitui o segundo maior conjunto de molhes do país, visa proteger a orla da erosão, melhorar a drenagem e a navegabilidade do rio, e criou um novo ponto de lazer e turismo para a região. O local permite atividades como caminhadas, pesca e ciclismo, tornando-se um cartão-postal e um benefício para a comunidade local e o mercado imobiliário.
                    </p>
                </div>
            </div>
        </div>
    )
}