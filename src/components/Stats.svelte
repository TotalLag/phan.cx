<script>
  export let coffee, code, cat;

  function kFormatter(num) {
    // https://stackoverflow.com/questions/9461621/format-a-number-as-2-5k-if-a-thousand-or-more-otherwise-900
    return Math.abs(num) > 999
      ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + 'k'
      : Math.sign(num) * Math.abs(num);
  }

  const beginning_coffee_date = new Date('07/15/1993'); // the time when I probably started my first cup of coffee
  const current_date = new Date();

  const time_difference = current_date.getTime() - beginning_coffee_date.getTime(); // assume I've been drinking everyday :)
  const days_difference = time_difference / (1000 * 60 * 60 * 24);

  let coffee_daily = [];
  for (let i = 0; i < days_difference; i++) {
    coffee_daily.push(Math.floor(Math.random() * 3) + 1); // 1-3 cups of coffee
  }

  coffee = kFormatter(coffee_daily.reduce((sum, next) => sum + next));
</script>

<div class="flex flex-row justify-between text-center">
  <div class="flex flex-col items-center w-full">
    <div class="font-bold">{coffee}</div>
    <div class="text-xs font-semibold text-gray-400 uppercase">Cups of coffee</div>
  </div>
  <div class="flex flex-col items-center w-full">
    <div class="font-bold">{kFormatter(code)}</div>
    <div class="text-xs font-semibold text-gray-400 uppercase">Lines of code</div>
  </div>
  <div class="flex flex-col items-center w-full">
    <div class="font-bold">{cat}</div>
    <div class="text-xs font-semibold text-gray-400 uppercase">Cat</div>
  </div>
</div>
