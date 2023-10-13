import style from './style.module.css';

function Header() {
    return (
        <header className={style.header}>
            <img className={style.img} src="src/componentes/images/image 68.png" alt="logo trybe" />
            <h1 className={style.titulo}>
                Trybe News!
            </h1>
        </header>
    );
}

export default Header;