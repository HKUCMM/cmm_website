import React from "react";
import "../css/mainpage.css";

const HomePageContainer = () => {
	return (
		<div>
			<div className="banner" id="mainpage-title">
				<div className="banner-content">
					<h1>CMM</h1>
					<h2>THE UNIVERSITY OF HONG KONG</h2>
					<h2>KOREAN CODING SOCIETY</h2>
				</div>
			</div>
			<div className="banner darker-banner" id="mainpage-about">
				<div className="banner-content">
					<h1>About Us</h1>
					<span>
						<p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab delectus corporis mollitia ipsam sint omnis sit ad voluptas accusamus veritatis nostrum molestias magnam eius, dolore nihil quos, facere aliquam accusantium? Alias illum consequuntur quasi impedit id sapiente, earum iusto aliquid.</p>
					</span>
				</div>
			</div>
		</div>
	)
};

export default HomePageContainer;
