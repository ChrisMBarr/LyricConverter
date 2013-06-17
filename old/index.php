<?php $useDebugFiles = false; ?>
<!DOCTYPE html>
<html lang=en-us class=no-js>
	<head>
		<meta charset="utf-8">
		<meta name="author" content="Chris Barr" />
		<meta name="description" content="Convert SongShow Plus songs into ProPresenter 4 or plain text files!" />
		<title>Lyric Converter</title> 
		<link rel="stylesheet" href="css/main.css" />
		<? if($useDebugFiles){ ?>
			<script src="js/modernizr.js"></script>
			<script src="http://code.jquery.com/jquery-1.8.3.min.js"></script>
			<script src="js/jquery.iframe.js"></script>
			<script src="js/jquery.uniform.js"></script>
			<script src="js/jquery.easing.js"></script>
			<script src="js/main.js"></script>
		<? }else{ ?>
			<script src="http://code.jquery.com/jquery-1.8.3.min.js"></script>
			<script src="js/main.min.js"></script>
		<?	} ?>
		<script type="text/javascript">
			var _gaq = _gaq || [];_gaq.push(['_setAccount', 'UA-2692727-32']);_gaq.push(['_trackPageview']);
			(function(){
			var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
			ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
			var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
			})();
		</script>
	</head>
	<body>
		<? if($useDebugFiles) echo '<a id="overlayToggle" href="javascript:{};" onclick="$(\'#overlay\').toggle();">grid</a>'; ?>
		<div class="container_12">
			<? if($useDebugFiles) echo '<div id="overlay"></div>'; ?>
			<aside class="grid_2">
				<header>
					<h1>Lyric Converter</h1>
				</header>
				<div id="nav-pointer-fixer"></div>
				<div id="nav-pointer"></div>
				<div id="divider"></div>
				<nav>
					<a href="#convert" class="selected">Convert</a>
					<a href="#about">About</a>
					<a href="#help">Help</a>
				</nav>
				<footer>
					<h5 class="alert">
						This is a beta, it may not work perfectly!
					</h5>

					<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
						<input type="hidden" name="cmd" value="_s-xclick">
						<input type="hidden" name="encrypted" value="-----BEGIN PKCS7-----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-----END PKCS7-----
						">
						Is LyricConverter useful? Concider <a href="#" class="donate-submit">donating to this site</a> to help support the cost!
						<img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">
					</form>

					<br />
					A Chris Barr Production
					<br />
					<a href='http://twitter.com/ChrisMBarr'>twitter.com/ChrisMBarr</a>
					<br />
					&copy; <?php echo date("Y"); ?>
				</footer>
			</aside>
			<section id="main" class="grid_10">
				<div id="contentFX">
				<?php
					//insert all the content
					require('lib/HTMLParts/Convert.php');
					require('lib/HTMLParts/About.php');
					require('lib/HTMLParts/Help.php');
				?>
				</div>
			</section>
			<div class="clear"></div>
		</div>
		<div id="bg-fixer"></div>
	</body>
</html>