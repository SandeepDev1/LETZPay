<script>
	import { onMount } from 'svelte';
	function toggleMenu() {
		var x = document.getElementById('menubar');
		if (x !== null) {
			console.log(x.style.display);
			if (x.style.display === 'flex') {
				x.style.display = 'none';
			} else {
				x.style.display = 'flex';
			}
		}
	}

	onMount(() => {});
</script>

<section class=" relative lg:sticky lg:top-0 w-[100%] bg-[#ededed] z-50 ">
	<div
		class="navbar lg:w-[87%] xl:w-[87%] w-[95%] mx-[auto] p-7 px-5 md:pb-7 pb-5 justify-between md:justify-between flex items-center"
	>
		<div class="logo flex items-center">
			<div>
				<img
					alt="logo"
					class=" w-[40px] h-[40px] bg-white rounded-full p-1 outline outline-2 "
					src="/letzpay.png"
				/>
			</div>
			<div class=" "><a href="/#" class="p-5 pl-2"><b class=" font-extrabold">LETZ</b>pay</a></div>
		</div>

		<!-- <button
			on:click|once={toggleMenu}
			class=" text-gray-800 underline underline-offset-4 text-lg  hover:text-zinc-800  md:hidden font-semibold"
			>MENU</button
		> -->

		<div class=" hidden md:flex justify-between">
			<div class=" text-gray-500 hover:text-zinc-800 text-xs lg:text-sm font-semibold">
				<a class=" px-2  md:px-3 py-5 lg:p-5" href="/#">Home</a>
			</div>
			<div class=" text-gray-500 hover:text-zinc-800 text-xs lg:text-sm font-semibold">
				<a class=" px-2  md:px-3 py-5 lg:p-5" href="/#">Features</a>
			</div>
			<div class=" text-gray-500 hover:text-zinc-800 text-xs lg:text-sm font-semibold">
				<a class=" px-2  md:px-3 py-5 lg:p-5" href="/#">How To Use</a>
			</div>
			<div class=" text-gray-500 hover:text-zinc-800 text-xs lg:text-sm font-semibold">
				<a class=" px-2  md:px-3 py-5 lg:p-5" href="/#">Docs</a>
			</div>
			<div class=" text-gray-500 hover:text-zinc-800 text-xs lg:text-sm font-semibold">
				<a class=" px-2  md:px-3 py-5 lg:p-5" href="/#">Contact Us</a>
			</div>
		</div>

		<div class=" md:block">
			<a
				href="/#"
				class="   text-right text-gray-700  font-semibold hover:bg-gray-700 hover:text-white outline outline-1 rounded-full text-[0.5rem] 2xs:text-xs lg:text-sm p-4"
				>GENERATE INVOICE</a
			>
		</div>
	</div>
  <div class=" flex md:hidden xs:w-[90%] mx-[auto] justify-between pb-5">
    <div class=" text-gray-500 hover:text-zinc-800 text-[0.6rem] 2xs:text-xs lg:text-sm font-semibold">
      <a class=" px-2  md:px-3 py-5 lg:p-5" href="/#">Home</a>
    </div>
    <div class=" text-gray-500 hover:text-zinc-800 text-[0.6rem] 2xs:text-xs lg:text-sm font-semibold">
      <a class=" px-2  md:px-3 py-5 lg:p-5" href="/#">Features</a>
    </div>
    <div class=" text-gray-500 hover:text-zinc-800 text-[0.6rem] 2xs:text-xs lg:text-sm font-semibold">
      <a class=" px-2  md:px-3 py-5 lg:p-5" href="/#">How To Use</a>
    </div>
    <div class=" text-gray-500 hover:text-zinc-800 text-[0.6rem] 2xs:text-xs lg:text-sm font-semibold">
      <a class=" px-2  md:px-3 py-5 lg:p-5" href="/#">Docs</a>
    </div>
    <div class=" text-gray-500 hover:text-zinc-800 text-[0.6rem] 2xs:text-xs lg:text-sm font-semibold">
      <a class=" px-2  md:px-3 py-5 lg:p-5" href="/#">Contact Us</a>
    </div>
  </div>

  <!-- <div class=" md:block hidden ">
    <a
      href="/#"
      class="   text-right text-gray-700  font-semibold hover:bg-gray-700 hover:text-white outline outline-1 rounded-full text-xs lg:text-sm p-4"
      >GENERATE INVOICE</a
    >
  </div> -->
</section>
