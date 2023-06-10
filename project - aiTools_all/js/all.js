$(document).ready(function() {

    // feedback__swiper
    const swiper = new Swiper('.swiper', {
        // swiper 斷點設定為 mobile first
        // 手機版呈現單欄排版
        slidesPerView: 1,
        spaceBetween: 24,
        breakpoints: {
            // 767px 以上呈現雙欄排版
            767: {
                slidesPerView: 2,
                slidesPerGroup: 2,
            },
            // 992px 以上呈現三欄排版
            992: {
                slidesPerView: 3,
                slidesPerGroup: 3,
            },
        },
        // 分頁按鈕
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });


    // 下拉選單
    $('.navbarBtn').click(function() {
        $('.navbarCollapse').toggleClass('show');
    });

    $('.filterDropdown-btn').click(function() {
        $('.filterDropdownCollapse').toggleClass('show');
    });

    $('.filterTimeOrder-btn').click(function() {
        $('.filterTimeOrderCollapse').toggleClass('show');
    });


    // 選單收合後，呈現所點選的選項文字
    $('.new-to-old').click(function(e) {
        e.preventDefault();
        $('.filterTimeOrderCollapse').toggleClass('show');
        $('.filterTimeOrder-btnTxt').text($('.new-to-old').text());
    });
      
    $('.old-to-new').click(function(e) {
        e.preventDefault();
        $('.filterTimeOrderCollapse').toggleClass('show');
        $('.filterTimeOrder-btnTxt').text($('.old-to-new').text());
    });


    $('.scrollToTop').click(function() {
        $('html, body').animate({
          scrollTop: 0
        }, 1600);
      });      


    
    // axios 串接 ->  取遠端資料
    const aiTools = document.querySelector('#aiTools');
    const pagination = document.querySelector('#pagination');

    const data = {
        type: '',
        sort: 0,
        page: 1,
        search: '',
    }

    let worksData = []
    let pagesData = {}

    function getData({ type, sort, page, search }) {
        const apiUrl = `https://2023-engineer-camp.zeabur.app/api/v1/works?sort=${sort}&page=${page}&${type ? `type=${type}&` : ''}${search ? `search=${search}` : ''}`

        axios.get(apiUrl)
        .then(function(res){
            // console.log(res);
            worksData = res.data.ai_works.data;
            pagesData = res.data.ai_works.page;
            // console.log('worksData', worksData);
            // console.log('pagesData', pagesData);

            renderWorks();   // 渲染至畫面
            renderPages();
        })
    }

    getData(data);

    // 渲染作品畫面
    function renderWorks() {
        let works = '';

        worksData.forEach(function(item){
            works += `<li class="productCardItem">
            <div class="productCardImg">
                <img src="${item.imageUrl}"
                    alt="product-image">
            </div>
            <div class="productCardBody">
                <div class="txtWrap">
                    <h5 class="productCardTitle fw-b">
                    ${item.title}
                    </h5>
                    <p class="productCardTxt fs-sm">
                    ${item.description}
                    </p>
                </div>
                <ul class="productCardInfo">
                    <li class="fw-m">AI 模型</li>
                    <li>${item.model}</li>
                </ul>
                <ul class="productCardInfo">
                    <li>#${item.type}</li>
                    <li>
                        <a href="${item.link}" target="_blank">
                            <span class="material-icons share">
                                share
                            </span>
                        </a>
                    </li>
                </ul>
            </div>
        </li>`
        });

        aiTools.innerHTML = works;
    }

    // 切換分頁
    function changePage(pagesData) {
        const pageLinks = document.querySelectorAll('a#page-link')
        let pageId = '';
      
        pageLinks.forEach(function(item){
      
          item.addEventListener('click', function(e){
            e.preventDefault();
            pageId = e.target.dataset.page;
            data.page = Number(pageId);
      
            if (!pageId) {
                data.page = Number(pagesData.current_page) + 1
            };
      
            getData(data);
          });
        });
    }

    // 選染分頁畫面
    function renderPages() {
    let pageStr = '';
  
    for (let i = 1; i <= pagesData.total_pages; i += 1) {
      pageStr += `<li class="${pagesData.current_page == i ? 'active' : ''}" >
        <a id="page-link" class="fs-sm fw-m ${pagesData.current_page == i ? 'disabled' : ''}" href="#"  data-page="${i}">${i}</a>
      </li>`
    };
  
    if (pagesData.has_next) {
        pageStr += `<li>
        <a id="page-link" class="fs-sm fw-m" href="#">
            <span class="material-icons">
                chevron_right
            </span>
        </a></li>`
    };

    pagination.innerHTML = pageStr;
  
    changePage(pagesData);
    }


    // 搜尋 #search ->（補）
    


    // 切換作品類型 #filter-btn ->（補）
    
    

    // 切換時間排序
    const desc = document.querySelector('.new-to-old');
    const asc = document.querySelector('.old-to-new');
    const btnSort = document.querySelector('.filterTimeOrder-btn');

    //  由新到舊 -> sort = 0
    desc.addEventListener('click', function(e){
        e.preventDefault();
        data.sort = 0;
        getData(data);
        btnSort.innerHTML = '<span class="fs-s fw-l filterTimeOrder-btnTxt">由新到舊</span><span class="material-icons fs-s">keyboard_arrow_down</span>';
    })
    
    //  由舊到新 -> sort = 1
    asc.addEventListener('click', function(e){
        e.preventDefault();
        data.sort = 1
        getData(data);
        btnSort.innerHTML = '<span class="fs-s fw-l filterTimeOrder-btnTxt">由舊到新</span><span class="material-icons fs-s">keyboard_arrow_down</span>';
    })



    // QA 折疊區塊、icon 切換
    $('.qaItem').click(function(e) {
        $(this).toggleClass('active');
        $(this).find('.add-icon').toggleClass('d-none');
        $(this).find('.remove-icon').toggleClass('show');
        $(this).find('.qaCollapse-content p').toggleClass('show');
    })



});

