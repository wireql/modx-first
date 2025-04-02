import Swiper from "swiper";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const swiper = new Swiper(".swiper", {
    modules: [Pagination],
    direction: "horizontal",
    slidesPerView: 1.2,
    spaceBetween: 20,

    pagination: {
        el: ".swiper-pagination",
    },
});
