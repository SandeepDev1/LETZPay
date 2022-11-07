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

		<div class=" hidden md:flex justify-between">
			<div class=" text-gray-500 hover:text-zinc-800 text-xs lg:text-sm font-semibold">
				<a class=" px-2  md:px-3 py-5 lg:p-5" href="#home">Home</a>
			</div>
			<div class=" text-gray-500 hover:text-zinc-800 text-xs lg:text-sm font-semibold">
				<a class=" px-2  md:px-3 py-5 lg:p-5" href="#features">Features</a>
			</div>
			<div class=" text-gray-500 hover:text-zinc-800 text-xs lg:text-sm font-semibold">
				<a class=" px-2  md:px-3 py-5 lg:p-5" href="#how_to_use">How To Use</a>
			</div>
			<div class=" text-gray-500 hover:text-zinc-800 text-xs lg:text-sm font-semibold">
				<a class=" px-2  md:px-3 py-5 lg:p-5" href="/docs">Docs</a>
			</div>
		</div>

	</div>
  <div class=" flex md:hidden xs:w-[90%] mx-[auto] justify-between pb-5">
    <div class=" text-gray-500 hover:text-zinc-800 text-[0.6rem] 2xs:text-xs lg:text-sm font-semibold">
      <a class=" px-2  md:px-3 py-5 lg:p-5" href="#home">Home</a>
    </div>
    <div class=" text-gray-500 hover:text-zinc-800 text-[0.6rem] 2xs:text-xs lg:text-sm font-semibold">
      <a class=" px-2  md:px-3 py-5 lg:p-5" href="#features">Features</a>
    </div>
    <div class=" text-gray-500 hover:text-zinc-800 text-[0.6rem] 2xs:text-xs lg:text-sm font-semibold">
      <a class=" px-2  md:px-3 py-5 lg:p-5" href="#how_to_use">How To Use</a>
    </div>
    <div class=" text-gray-500 hover:text-zinc-800 text-[0.6rem] 2xs:text-xs lg:text-sm font-semibold">
      <a class=" px-2  md:px-3 py-5 lg:p-5" href="/docs">Docs</a>
    </div>
  </div>
</section>
