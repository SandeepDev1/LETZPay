<script>
</script>

<section id="home" class="herosec w-[92%] mt-[-90px] md:mt-[0px] overflow-x-hidden md:bg-none  mr-0">
  <div class="hero wrapper flex flex-col  md:flex-row-reverse overflow-hidden items-center md:justify-evenly ">
    <div class="p-10 right md:relative md:top-[0%] z-[20] scale-[0.6]  md:block  md:scale-[0.7] lg:scale-[0.9]">

      <div class="relative z-[20] md:block w-[17rem] h-[26rem] top-[-30px] md:left-[-50px]  rounded-3xl bg-[#e4e4e4] ">
        <div class=" relative top-[2rem] left-[2rem]  w-[17rem] h-[26rem] rounded-3xl bg-[#d4d4d4] ">
          <div
            class="w-[18rem] h-[5rem] drop-shadow-lg bg-white z-[10]  absolute top-[18rem] -left-[5rem] rounded-3xl"></div>
          <div class="w-[8rem] h-[8rem] rounded-3xl drop-shadow-lg bg-white absolute top-[1rem] left-[13rem]"></div>
          <div
            class="w-[14rem] h-[17rem] relative top-[13rem] left-[2rem] drop-shadow-sm bg-[#6555df] rounded-3xl"></div>
          <img alt="coin" src="/coins1.webp" class="z-50 relative h-[90px] coins left-[-100px] top-[-250px] ">
          <img alt="coin" src="/coins3.webp" class="z-50 relative h-[90px] coins left-[250px] top-[-100px]">
          <img alt="coin" src="/coins2.webp" class="z-50 relative h-[90px] coins left-[200px] top-[-500px]  ">
          <img alt="coin" src="/coins4.webp" class="z-50 relative h-[90px] coins left-[-50px] top-[-200px]">

        </div>
      </div>
    </div>

    <div class="left pr-4 md:pr-0 mt-[-20px] md:mt-[0px] flex pb-10 justify-center  z-20 flex-col">
      <div class="grad absolute  blur-2xl z-[-50] h-[300px] lg:w-[300px] w-[200px]"></div>

      <h1 class="text-zinc-900 font-bold text-3xl 2xs:text-5xl md:text-6xl lg:text-7xl xl:text-8xl pl-5  ">Secure</h1>
      <h1 class="text-zinc-900 font-bold text-3xl 2xs:text-5xl md:text-6xl lg:text-7xl xl:text-8xl pl-5 mt-2 ">
        & Hassle free
      </h1>
      <p class="text-zinc-800 pl-5 text-xs 2xs:text-base lg:text-2xl font-semibold mt-3"> Crypto Payments made easy<br>
        <span class="text-zinc-800 text-[0.65rem] 2xs:text-xs lg:text-xl ">Non-Custodial and No sign-up required</span>
      </p>
      <button on:click={() => window.location.href = "/docs"} class="btn-hover color-4 text-2xl">Start Now</button>
    </div>


  </div>
</section>
<style>
    .coins {
        -webkit-filter: drop-shadow(5px 5px 5px #222);
        filter: drop-shadow(5px 5px 5px rgb(196, 196, 196));
    }

    .btn-hover.color-4 {
        background-image: linear-gradient(to right, #667eea, #764ba2, #6B8DD6, #8E37D7);
        box-shadow: 0 4px 15px 0 rgba(116, 79, 168, 0.75);
    }

    .btn-hover {
        width: 200px;

        font-weight: 600;
        color: #fff;
        cursor: pointer;
        margin: 20px;
        height: 55px;
        text-align: center;
        border: none;
        background-size: 300% 100%;

        border-radius: 50px;
        moz-transition: all .4s ease-in-out;
        -o-transition: all .4s ease-in-out;
        -webkit-transition: all .4s ease-in-out;
        transition: all .4s ease-in-out;
    }

    .btn-hover:hover {
        background-position: 100% 0;
        moz-transition: all .4s ease-in-out;
        -o-transition: all .4s ease-in-out;
        -webkit-transition: all .4s ease-in-out;
        transition: all .4s ease-in-out;
    }

    .btn-hover:focus {
        outline: none;
    }
</style>