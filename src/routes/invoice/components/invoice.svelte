<script>
  import {
    activeCryptoCurrency,
    activeCryptoIndex,
    activeCurrency,
    activeCurrencyIndex,
    activeElement, isAdvancedDropDownActive,
    isCryptoDropDownActive,
    isCurrencyDropDownActive,
    tempIsCryptoDropDownActive,
    tempIsCurrencyDropDownActive
  } from "$lib/components/stores.js";
  import { page } from "$app/stores";
  import { onMount } from "svelte";

  let cryptoContainer;
  let currencyContainer;

  function onWindowClick(e) {
    if (cryptoContainer.contains(e.target) === false) {
      isCryptoDropDownActive.set(false);
    }

    if (currencyContainer.contains(e.target) === false) {
      isCurrencyDropDownActive.set(false);
    }
  }

  onMount(() => {

    isCryptoDropDownActive.subscribe(value => {
      const element = document.getElementById("dropdown_crypto_menu");
      if (value) {
        element.classList.remove("dropdown-menu-hide");
        element.classList.add("dropdown-menu-show");
      } else {
        element.classList.remove("dropdown-menu-show");
        element.classList.add("dropdown-menu-close");
        setTimeout(() => {
          element.classList.remove("dropdown-menu-close");
          element.classList.add("dropdown-menu-hide");
        }, 260);
      }
    });

    isCurrencyDropDownActive.subscribe(value => {
      const element = document.getElementById("dropdown_currency_menu");
      if (value) {
        element.classList.remove("dropdown-menu-hide");
        element.classList.add("dropdown-menu-show");
      } else {
        element.classList.remove("dropdown-menu-show");
        element.classList.add("dropdown-menu-close");
        setTimeout(() => {
          element.classList.remove("dropdown-menu-close");
          element.classList.add("dropdown-menu-hide");
        }, 260);
      }
    });

  });

  function generateArrayTillIndex(index) {
    let array = [];
    for (let i = 0; i < index; i++) {
      array.push(i);
    }

    return array;
  }

  activeCryptoCurrency.set($page.data[0].crypto[0]);
  activeCryptoIndex.set(0);

  activeCurrency.set($page.data[1].currency[0]);
  activeCurrencyIndex.set(0);

  const cryptoCurrencyKeys = generateArrayTillIndex($page.data[0].crypto.length);
  const currencyKeys = generateArrayTillIndex($page.data[1].currency.length);

  let data = ["Invoice Data", "Confirmation", "Payment Link"];
  let tempActiveElement = 0;

  activeElement.subscribe(value => {
    tempActiveElement = value;
  });

  function setActiveCryptoCurrency(index) {
    isCryptoDropDownActive.set(false);
    activeCryptoCurrency.set($page.data[0].crypto[index]);
    activeCryptoIndex.set(index);
  }

  function setActiveCurrency(index) {
    isCurrencyDropDownActive.set(false);
    activeCurrency.set($page.data[1].currency[index]);
    activeCurrencyIndex.set(index);
  }

</script>

<svelte:window on:click={onWindowClick} />

<section class="flex flex-col items-center h-[100vh]">
  <div class="flex bg-zinc-900 lg:max-w-[800px] p-4 mt-2 rounded-2xl">
    {#each data as element, i}
      <div class={`p-2 rounded-lg ${$activeElement === i ? "bg-purple-800": ""}`}>
        <p class={`${$activeElement === i ? "text-white": "text-gray-400"}`}>{element}</p>
      </div>

      {#if i < data.length - 1}
        <div class="min-w-[50px] flex justify-center items-center">
          <hr class={`${$activeElement > i ? "bg-purple-600": "bg-gray-400"} h-[32px] border-0 rotate-90 w-[2px]`}>
        </div>
      {/if}
    {/each}
  </div>

  {#if $activeElement === 0}

    <div class="flex flex-col my-auto">
      <div class="flex">

        <div bind:this={currencyContainer} class="flex pr-6">
          <div class="flex">
            <div class="relative h-[60px] w-[300px]">
              <div class="relative">
                <input class="absolute h-[60px] w-[300px] border-2 border-black bg-gray-200 rounded-lg px-2" type="text"
                       name="Currency Name" id="currency_value">
                <label class="absolute left-[10px] text-lg top-[15px]"
                       for="currency_value">Send {$activeCurrency.symbol}</label>
              </div>

              <div on:click={() => {isCurrencyDropDownActive.set(!tempIsCurrencyDropDownActive)}}
                   class="absolute right-[10px] h-[50px] w-[100px] top-[5px] pl-2 rounded-lg bg-white flex justify-center items-center">
                <div class="flex pr-2">
                  <p class="text-sm pr-2">{$activeCurrency.name}</p>
                  <img class="h-5 w-5" src={$activeCurrency.image} alt="" />
                </div>
                <svg class={`w-4 h-4 ${$isCurrencyDropDownActive ? "animate-svg-in": "animate-svg-out"}`} fill="none"
                     stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>

              <div id="dropdown_currency_menu"
                   class={`dropdown-menu-hide absolute top-[70px] w-[300px] bg-gray-200 rounded-2xl py-4 z-10`}>
                {#each currencyKeys as key}
                  <div on:click={() => setActiveCurrency(key)}
                       class={`flex items-center h-14 pl-4 pt-2 pb-2 hover:bg-white/50 ${key === $activeCurrencyIndex ? "pointer-events-none bg-white/70" : "pointer-events-auto"}`}>
                    <img class="h-10 w-10 mr-4" src={$page.data[1].currency[key].image} alt="" />
                    <div class="flex flex-col">
                      <p class="text-black">{$page.data[1].currency[key].name}</p>
                      <p class="text-gray-600">{$page.data[1].currency[key].symbol}</p>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          </div>
        </div>

        <div
          class="w-[80px] flex justify-center items-center rounded-xl border-2 border-black border-dashed bg-white mr-6 hover:bg-black hover:text-white transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
               stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </div>

        <div bind:this={cryptoContainer} class="flex">
          <div class="flex">
            <div class="relative h-[60px] w-[300px]">
              <div class="relative">
                <div class="absolute h-[60px] text-lg w-[300px] border-2 border-black bg-gray-200 rounded-lg px-2"
                     id="crypto_value">
                </div>
                <label class="absolute left-[10px] text-lg top-[15px]"
                       for="crypto_value">You Get {$activeCryptoCurrency.currency}</label>
              </div>

              <div on:click={() => {isCryptoDropDownActive.set(!tempIsCryptoDropDownActive)}}
                   class="absolute right-[10px] h-[50px] w-[100px] top-[5px] pl-2 rounded-lg bg-white flex justify-center items-center">
                <div class="flex pr-2">
                  <p class="text-sm pr-2">{$activeCryptoCurrency.currency}</p>
                  <img class="h-5 w-5" src={$activeCryptoCurrency.image} alt="" />
                </div>
                <svg class={`w-4 h-4 ${$isCryptoDropDownActive ? "animate-svg-in": "animate-svg-out"}`} fill="none"
                     stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>

              <div id="dropdown_crypto_menu"
                   class={`dropdown-menu-hide absolute top-[70px] w-[300px] bg-gray-200 rounded-2xl py-4 z-10`}>
                {#each cryptoCurrencyKeys as key}
                  <div on:click={() => setActiveCryptoCurrency(key)}
                       class={`flex items-center h-14 pl-4 pt-2 pb-2 hover:bg-white/50 ${key === $activeCryptoIndex ? "pointer-events-none bg-white/70" : "pointer-events-auto"}`}>
                    <img class="h-10 w-10 mr-4" src={$page.data[0].crypto[key].image} alt="" />
                    <div class="flex flex-col">
                      <p class="text-black">{$page.data[0].crypto[key].currency}</p>
                      <p class="text-gray-600">{$page.data[0].crypto[key].name}</p>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          </div>
        </div>

      </div>

      <div class="flex justify-center mt-[40px]">
        <div class="relative h-[60px] w-[500px]">
          <div class="relative">
            <input class="absolute h-[60px] w-[500px] border-2 border-black bg-gray-200 rounded-lg px-2" type="text"
                   name="Currency Name" id="address_value">
            <label class="absolute left-[10px] text-lg top-[15px]"
                   for="address_value">Enter {$activeCryptoCurrency.currency} Address</label>
          </div>
        </div>
      </div>

      <div on:click={() => {isAdvancedDropDownActive}} class="">

      </div>

      <div class="flex justify-center mt-[40px]">
        <div class="relative h-[60px] w-[500px]">
          <div class="relative">
            <input class="absolute h-[60px] w-[500px] border-2 border-black bg-gray-200 rounded-lg px-2" type="text"
                   name="Currency Name" id="webhook_url">
            <label class="absolute left-[10px] text-lg top-[15px]"
                   for="address_value">Webhook URL</label>
          </div>
        </div>
      </div>

      <div class="flex justify-center mt-[40px]">
        <div class="relative h-[60px] w-[500px]">
          <div class="relative">
            <input class="absolute h-[60px] w-[500px] border-2 border-black bg-gray-200 rounded-lg px-2" type="text"
                   name="Currency Name" id="metadata">
            <label class="absolute left-[10px] text-lg top-[15px]"
                   for="address_value">Metadata</label>
          </div>
        </div>
      </div>

      <div class="flex justify-center mt-10">
        <button on:click={() => activeElement.set(1)} class="h-10 w-24 bg-purple-700 text-white rounded-xl border-2 border-dashed border-purple-800 hover:bg-white hover:text-black transition">Next</button>
      </div>
    </div>
  {/if}
</section>

<style>
    label {
        transform-origin: 0 0;
        transition: all 0.3s ease-in-out;
    }

    input:focus + label {
        transform: translateY(-15px) scale(0.7);
        color: gray;
    }

    input:focus {
        outline: none;
    }

    .animate-svg-in {
        transform: rotate(-180deg);
        transition: transform 0.2s ease-in-out;
    }

    .animate-svg-out {
        transform: rotate(-360deg);
        transition: transform 0.2s ease-in-out;
    }

    @keyframes dropdownOpen {
        from {
            transform: scaleY(0);
            opacity: 0;
        }
        to {
            transform: scaleY(1);
            opacity: 100;
        }
    }

    @keyframes dropdownClosed {
        from {
            transform: scaleY(1);
            opacity: 100;
        }
        to {
            transform: scaleY(0);
            opacity: 0;
        }
    }

    .dropdown-menu-show {
        transform-origin: top;
        display: block;
        animation: dropdownOpen 250ms ease-in-out;
    }

    .dropdown-menu-close {
        transform-origin: top;
        opacity: 0;
        animation: dropdownClosed 250ms ease-in-out;
    }

    .dropdown-menu-hide {
        display: none;
    }

</style>