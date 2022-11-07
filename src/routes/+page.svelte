<script>
  import Features from "$lib/components/features.svelte";
    import Nav from "$lib/components/nav.svelte";
    import Hero from "$lib/components/hero.svelte";
    import Docon from "$lib/components/footer.svelte";
    import Hwtouse from "$lib/components/hwtouse.svelte";
</script>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com">
<link href="https://fonts.googleapis.com/css2?family=Merriweather+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

<Nav/>
<div class="flex flex-col justify-evenly  items-center">
  
  <Hero/>
  <Features/>
  <Hwtouse/>
  <Docon/>
</div>