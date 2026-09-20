const corridorData = [
    {
        rank: 1,
        name: "Bihar → Delhi",
        transactions: 2802353,
        share: 31.61
    },
    {
        rank: 2,
        name: "Uttar Pradesh → Delhi",
        transactions: 2362517,
        share: 26.64
    },
    {
        rank: 3,
        name: "Uttar Pradesh → Maharashtra",
        transactions: 477042,
        share: 5.38
    },
    {
        rank: 4,
        name: "Bihar → Haryana",
        transactions: 401921,
        share: 4.53
    },
    {
        rank: 5,
        name: "Uttar Pradesh → Haryana",
        transactions: 395752,
        share: 4.46
    },
    {
        rank: 6,
        name: "Bihar → Maharashtra",
        transactions: 296386,
        share: 3.34
    },
    {
        rank: 7,
        name: "Madhya Pradesh → Delhi",
        transactions: 245382,
        share: 2.77
    },
    {
        rank: 8,
        name: "Uttar Pradesh → Uttarakhand",
        transactions: 133763,
        share: 1.51
    },
    {
        rank: 9,
        name: "Haryana → Delhi",
        transactions: 109898,
        share: 1.24
    },
    {
        rank: 10,
        name: "Uttar Pradesh → Rajasthan",
        transactions: 103847,
        share: 1.17
    }
];


const chart = document.getElementById("corridor-chart");
const info = document.getElementById("corridor-info");

if (chart && info) {

    const maximum = Math.max(
        ...corridorData.map(item => item.transactions)
    );

    corridorData.forEach((item, index) => {

        const row = document.createElement("div");
        row.className = "corridor-row";
        row.tabIndex = 0;

        const rank = document.createElement("div");
        rank.className = "corridor-rank";
        rank.textContent = item.rank;

        const label = document.createElement("div");
        label.className = "corridor-label";
        label.textContent = item.name;

        const barArea = document.createElement("div");
        barArea.className = "corridor-bar-area";

        const bar = document.createElement("div");
        bar.className = "corridor-bar";

        const width =
            (item.transactions / maximum) * 100;

        const value = document.createElement("span");
        value.className = "corridor-value";
        value.textContent =
            (item.transactions / 1000000).toFixed(2) + "m";

        /*
         * Large bars get the number inside.
         * Small bars get the number outside.
         */

        if (width >= 18) {

            bar.appendChild(value);

        } else {

            const outsideValue =
                document.createElement("span");

            outsideValue.className =
                "corridor-value-outside";

            outsideValue.textContent =
                (item.transactions / 1000000).toFixed(2) + "m";

            barArea.appendChild(outsideValue);
        }

        barArea.appendChild(bar);

        row.appendChild(rank);
        row.appendChild(label);
        row.appendChild(barArea);

        chart.appendChild(row);


        // Animate bars
        setTimeout(() => {
            bar.style.width = width + "%";
        }, 100 + index * 100);


        // Interaction
        function selectRoute() {

            document
                .querySelectorAll(".corridor-row")
                .forEach(other => {
                    other.classList.remove("active");
                });

            row.classList.add("active");

            chart.classList.add("has-selection");

            info.innerHTML = `
                <div class="selected-route">
                    <span class="selected-rank">
                        #${item.rank}
                    </span>

                    <strong>
                        ${item.name}
                    </strong>
                </div>

                <div class="selected-number">
                    ${item.transactions.toLocaleString("en-IN")}
                </div>

                <div class="selected-share">
                    transactions · ${item.share.toFixed(2)}%
                    of India's 2025 interstate total
                </div>
            `;
        }

        row.addEventListener(
            "mouseenter",
            selectRoute
        );

        row.addEventListener(
            "click",
            selectRoute
        );

        row.addEventListener(
            "focus",
            selectRoute
        );

        row.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    selectRoute();
                }
            }
        );

    });
}