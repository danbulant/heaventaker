
<h2>SUCCESS</h2>
<style>
    h2 {
        position: relative;
        width: 400px;
        color: white;
        font-size: 70px;
        letter-spacing: 12px;
        text-align: center;
        margin: 15px auto;
        text-shadow: 0 0 6px white;
        animation: shadowAppear .4s ease-out;
    }
    h2::before, h2::after {
        position: absolute;
        content: "";
        background: white;
        box-shadow: 0 0 15px white;
        border-radius: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
    h2::before {
        animation: successLeft .4s, appear .2s;
        animation-timing-function: ease-out;
        animation-delay: .2s, 0;
    }
    h2::after {
        animation: successRight .4s, appear .2s;
        animation-timing-function: ease-out;
        animation-delay: .2s, 0;
    }
</style>