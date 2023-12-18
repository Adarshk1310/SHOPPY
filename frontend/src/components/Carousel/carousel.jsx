import { useDispatch, useSelector } from "react-redux";
import styles from "./carousel.module.css";
import { actions, itemSelector } from "../../itemReducer";



const Carousel=()=>{

    const {imageUrl} = useSelector(itemSelector);
    const dispatch =useDispatch();

    const handleCarousel=()=>{
        dispatch(actions.setCarousel());
    }


    return <div className={styles.carouselPage}>

        <img className={styles.productImage} src={imageUrl} alt="ProductImage"></img>
        <img className={styles.closebutton} src="https://cdn-icons-png.flaticon.com/128/12435/12435336.png" onClick={handleCarousel} alt="close Button"></img>
    </div>
}

export default Carousel;