a:6:{s:5:"child";a:1:{s:0:"";a:1:{s:3:"rss";a:1:{i:0;a:6:{s:4:"data";s:4:"
  
";s:7:"attribs";a:1:{s:0:"";a:1:{s:7:"version";s:3:"2.0";}}s:8:"xml_base";s:0:"";s:17:"xml_base_explicit";b:0;s:8:"xml_lang";s:0:"";s:5:"child";a:1:{s:0:"";a:1:{s:7:"channel";a:1:{i:0;a:6:{s:4:"data";s:64:"
    
    
    
    
      
      
        
        
        
  ";s:7:"attribs";a:0:{}s:8:"xml_base";s:0:"";s:17:"xml_base_explicit";b:0;s:8:"xml_lang";s:0:"";s:5:"child";a:2:{s:0:"";a:5:{s:5:"title";a:1:{i:0;a:5:{s:4:"data";s:33:"Security Notices - MODX Community";s:7:"attribs";a:0:{}s:8:"xml_base";s:0:"";s:17:"xml_base_explicit";b:0;s:8:"xml_lang";s:0:"";}}s:4:"link";a:1:{i:0;a:5:{s:4:"data";s:62:"https://community.modx.com/c/announcements/security-notices/26";s:7:"attribs";a:0:{}s:8:"xml_base";s:0:"";s:17:"xml_base_explicit";b:0;s:8:"xml_lang";s:0:"";}}s:11:"description";a:1:{i:0;a:5:{s:4:"data";s:167:"Topics in the 'Security Notices' category This is a subcategory of Announcements for Security Notices. Older security notices can be found in the archived MODX Forums.";s:7:"attribs";a:0:{}s:8:"xml_base";s:0:"";s:17:"xml_base_explicit";b:0;s:8:"xml_lang";s:0:"";}}s:13:"lastBuildDate";a:1:{i:0;a:5:{s:4:"data";s:31:"Fri, 22 Nov 2024 21:57:00 +0000";s:7:"attribs";a:0:{}s:8:"xml_base";s:0:"";s:17:"xml_base_explicit";b:0;s:8:"xml_lang";s:0:"";}}s:4:"item";a:3:{i:0;a:6:{s:4:"data";s:130:"
          
          
          
          
          
          
          
          
          
          
          
        ";s:7:"attribs";a:0:{}s:8:"xml_base";s:0:"";s:17:"xml_base_explicit";b:0;s:8:"xml_lang";s:0:"";s:5:"child";a:3:{s:0:"";a:7:{s:5:"title";a:1:{i:0;a:5:{s:4:"data";s:51:"MODX Login Extra PHP Object Injection Vulnerability";s:7:"attribs";a:0:{}s:8:"xml_base";s:0:"";s:17:"xml_base_explicit";b:0;s:8:"xml_lang";s:0:"";}}s:8:"category";a:1:{i:0;a:5:{s:4:"data";s:16:"Security Notices";s:7:"attribs";a:0:{}s:8:"xml_base";s:0:"";s:17:"xml_base_explicit";b:0;s:8:"xml_lang";s:0:"";}}s:11:"description";a:1:{i:0;a:5:{s:4:"data";s:4904:"
            <h2><a name="p-33100-overview-1" class="anchor" href="https://community.modx.com#p-33100-overview-1"></a>Overview</h2>
<ul>
<li><strong>Project</strong>: <a href="https://extras.modx.com/package/login">Login Extra</a></li>
<li><strong>CVE ID</strong>: <a href="https://www.cve.org/CVERecord?id=CVE-2024-55039">CVE-2024-55039</a> (pending)</li>
<li><strong>Affected Versions</strong>: 1.5.2 through 1.9.13</li>
<li><strong>Fixed Version</strong>: <a href="https://extras.modx.com/package/login?version=1.9.14-pl">1.9.14</a></li>
<li><strong>Release Date</strong>: 2024-11-22</li>
<li><strong>Severity</strong>: Critical</li>
<li><strong>CVSS v4.0 Score</strong>: 9.4</li>
<li><strong>CVSS v4.0 Vector</strong>: CVSS:4.0/AV:N/AC:L/AT:N/PR:L/UI:N/VC:H/VI:H/VA:H/SC:H/SI:H/SA:H</li>
</ul>
<h2><a name="p-33100-vulnerability-details-2" class="anchor" href="https://community.modx.com#p-33100-vulnerability-details-2"></a>Vulnerability Details</h2>
<h3><a name="p-33100-type-3" class="anchor" href="https://community.modx.com#p-33100-type-3"></a>Type</h3>
<p>Remote Code Execution (RCE) via PHP Object Injection</p>
<h3><a name="p-33100-description-4" class="anchor" href="https://community.modx.com#p-33100-description-4"></a>Description</h3>
<p>A critical vulnerability has been identified in the MODX Login Extra that allows arbitrary PHP code execution through PHP Object Injection. The vulnerability stems from unsafe deserialization of user-supplied data using PHP’s <code>unserialize()</code> function without proper sanitization.</p>
<h3><a name="p-33100-attack-vector-5" class="anchor" href="https://community.modx.com#p-33100-attack-vector-5"></a>Attack Vector</h3>
<p>An authenticated user, regardless of their permission level, can exploit this vulnerability by submitting specially crafted data through the Login form. The vulnerability can be triggered when:</p>
<ol>
<li>The system processes user input through the Login form</li>
<li>The malicious payload is passed to the unsafe <code>unserialize()</code> function</li>
<li>The resulting PHP object injection leads to arbitrary code execution</li>
</ol>
<h2><a name="p-33100-affected-systems-6" class="anchor" href="https://community.modx.com#p-33100-affected-systems-6"></a>Affected Systems</h2>
<p>The vulnerability affects MODX Revolution installations that meet ALL of the following criteria:</p>
<ol>
<li>Have the Login Extra installed (versions 1.5.2 to 1.9.13)</li>
<li>Have a web-accessible login form using the Login Extra</li>
<li>Allow user authentication</li>
</ol>
<p><strong>Note</strong>: Systems with Registration forms using the Login Extra may be particularly vulnerable if user validation is not required.</p>
<h2><a name="p-33100-mitigation-7" class="anchor" href="https://community.modx.com#p-33100-mitigation-7"></a>Mitigation</h2>
<p><strong>Immediate Update Required</strong>: Upgrade <a href="https://extras.modx.com/package/login?version=1.9.14-pl">Login Extra to version 1.9.14</a> or later using the MODX Extras Installer in your MODX Revolution Projects.</p>
<h2><a name="p-33100-technical-details-8" class="anchor" href="https://community.modx.com#p-33100-technical-details-8"></a>Technical Details</h2>
<p>The vulnerability exists due to:</p>
<ul>
<li>Unsafe usage of PHP’s <code>unserialize()</code> function</li>
<li>Lack of input validation before deserialization</li>
<li>Insufficient permission checking in the login process</li>
</ul>
<h2><a name="p-33100-credits-9" class="anchor" href="https://community.modx.com#p-33100-credits-9"></a>Credits</h2>
<ul>
<li><strong>Discovery</strong>: <a href="https://www.mcdruid.co.uk">Drew Webber</a></li>
<li><strong>Resolution</strong>: <a href="https://github.com/jako">Thomas Jakobi</a> and <a href="https://github.com/theboxer">John Peca</a></li>
<li><strong>Coordination</strong>: MODX Security Team</li>
</ul>
<h2><a name="p-33100-timeline-10" class="anchor" href="https://community.modx.com#p-33100-timeline-10"></a>Timeline</h2>
<ul>
<li><strong>Discovery Date</strong>: 2024-11-22</li>
<li><strong>Fix Development</strong>: 2024-11-22</li>
<li><strong>Public Disclosure</strong>: 2024-11-22</li>
</ul>
<h2><a name="p-33100-references-11" class="anchor" href="https://community.modx.com#p-33100-references-11"></a>References</h2>
<ul>
<li>MODX Security Team Contact: <a>Security Team</a></li>
<li>Fixed Version Download: <a href="https://extras.modx.com/package/login?version=1.9.14-pl">Login 1.9.14</a></li>
</ul>
<h2><a name="p-33100-revision-history-12" class="anchor" href="https://community.modx.com#p-33100-revision-history-12"></a>Revision History</h2>
<ul>
<li><strong>2024-11-22</strong>: Initial advisory publication</li>
</ul>
            <p><small>2 posts - 1 participant</small></p>
            <p><a href="https://community.modx.com/t/modx-login-extra-php-object-injection-vulnerability/8174">Read full topic</a></p>
          ";s:7:"attribs";a:0:{}s:8:"xml_base";s:0:"";s:17:"xml_base_explicit";b:0;s:8:"xml_lang";s:0:"";}}s:4:"link";a:1:{i:0;a:5:{s:4:"data";s:85:"https://community.modx.com/t/modx-login-extra-php-object-injection-vulnerability/8174";s:7:"attribs";a:0:{}s:8:"xml_base";s:0:"";s:17:"xml_base_explicit";b:0;s:8:"xml_lang";s:0:"";}}s:7:"pubDate";a:1:{i:0;a:5:{s:4:"data";s:31:"Fri, 22 Nov 2024 21:57:00 +0000";s:7:"attribs";a:0:{}s:8:"xml_base";s:0:"";s:17:"xml_base_explicit";b:0;s:8:"xml_lang";s:0:"";}}s:4:"guid";a:1:{i:0;a:5:{s:4:"data";s:29:"community.modx.com-topic-8174";s:7:"attribs";a:1:{s:0:"";a:1:{s:11:"isPermaLink";s:5:"false";}}s:8:"xml_base";s:0:"";s:17:"xml_base_explicit";b:0;s:8:"xml_lang";s:0:"";}}s:6:"source";a:1:{i:0;a:5:{s:4:"data";s:51:"MODX Login Extra PHP Object Injection Vulnerability";s:7:"attribs";a:1:{s:0:"";a:1:{s:3:"url";s:89:"https://community.modx.com/t/modx-login-extra-php-object-injection-vulnerability/8174.rss";}}s:8:"xml_base";s:0:"";s:17:"xml_base_explicit";b:0;s:8:"xml_lang";s:0:"";}}}s:32:"http://purl.org/dc/elements/1.1/";a:1:{s:7:"creator";a:1:{i:0;a:5:{s:4:"data";s:11:"smashingred";s:7:"attribs";a:0:{}s:8:"xml_base";s:0:"";s:17:"xml_base_explicit";b:0;s:8:"xml_lang";s:0:"";}}}s:25:"http://www.discourse.org/";a:3:{s:11:"topicPinned";a:1:{i:0;a:5:{s:4:"data";s:2:"No";s:7:"attribs";a:0:{}s:8:"xml_base";s:0:"";s:17:"xml_base_explicit";b:0;s:8:"xml_lang";s:0:"";}}s:11:"topicClosed";a:1:{i:0;a:5:{s:4:"data";s:3:"Yes";s:7:"attribs";a:0:{}s:8:"xml_base";s:0:"";s:17:"xml_base_explicit";b:0;s:8:"xml_lang";s:0:"";}}s:13:"topicArchived";a:1:{i:0;a:5:{s:4:"data";s:2:"No";s:7:"attribs";a:0:{}s:8:"xml_base";s:0:"";s:17:"xml_base_explicit";b:0;s:8:"xml_lang";s:0:"";}}}}}i:1;a:6:{s:4:"data";s:130:"
          
          
          
          
          
          
          
          
          
          
          
        ";s:7:"attribs";a:0:{}s:8:"xml_base";s:0:"";s:17:"xml_base_explicit";b:0;s:8:"xml_lang";s:0:"";s:5:"child";a:3:{s:0:"";a:7:{s:5:"title";a:1:{i:0;a:5:{s:4:"data";s:34:"MODX setup/ Directory Site Exploit";s:7:"attribs";a:0:{}s:8:"xml_base";s:0:"";s:17:"xml_base_explicit";b:0;s:8:"xml_lang";s:0:"";}}s:8:"category";a:1:{i:0;a:5:{s:4:"data";s:16:"Security Notices";s:7:"attribs";a:0:{}s:8:"xml_base";s:0:"";s:17:"xml_base_explicit";b:0;s:8:"xml_lang";s:0:"";}}s:11:"description";a:1:{i:0;a:5:{s:4:"data";s:4041:"
            <p><strong>Product:</strong> MODX Revolution<br>
<strong>Severity:</strong> Critical<br>
<strong>Versions:</strong> &lt;=2.7.0<br>
<strong>Vulnerability type(s):</strong> Site Exploit<br>
<strong>Date Published:</strong> 2019-04-01</p>
<p><strong>Issue</strong><br>
There is currently an active exploit of sites with an intact MODX Revolution <code>setup/</code> directory. This can give <em>anyone</em> on the internet complete access to your site and possibly your server with trivial effort. This directory should <em>never</em> be left in place once a site is installed.</p>
<p><strong>Check Your Site</strong><br>
You can check if your site is vulnerable by entering your site URL with a <code>/setup/</code> added at the end, for example:<br>
<code>https://www.example.com/setup/</code></p>
<p><strong>What to Do</strong><br>
If you see a MODX installation utility, you should log into your server via FTP or SSH <strong>immediately</strong>, and remove this directory. If your site is working as expected, your site may be safe, but please review the additional information below.</p>
<p><strong>Why it Matters</strong><br>
Using the MODX installation script above, a malicious individual can re-install MODX and point to any database they wish including remote databases. Once a site is “re-installed” they can then use the Manager’s file manager to upload other back door files to your server. This can potentially lead to more severe issues such as having the entire server <a href="https://en.wikipedia.org/wiki/Rootkit">rootkitted</a>, setting up spam mailers, or uploading crypto miners to take advantage of computing resources on your server.</p>
<p><strong>If Your Site Has Been Compromised</strong><br>
If your site has been compromised or is not working correctly, and the setup folder per the above was in place, you must first re-connect your site to the correct database and server. Ask your web host or sysadmin to reset your database password and give you the new database credentials. Once you have those, update the MODX config file—by default located at <code>core/config/config.inc.php</code>—with the correct settings.</p>
<p><strong>Keep Up with Updates</strong><br>
You should also upgrade your MODX version to the latest production release (currently 2.7.1) and upgrade all Extras if they are not current. Keeping up with updates is critical to maintaining a secure site, as it plays a key role in <a href="https://support.modx.com/hc/en-us/articles/360010644353-How-Websites-Get-Hacked-and-How-to-Protect-Yourself">helping prevent sites from compromise</a>.</p>
<p><strong>Malware Scanning</strong><br>
Finally, you should run a malware scanner to make sure other exploits haven’t already been uploaded to your site as described above. We have a series of articles that walks you through recovering from a site compromise, which hopefully will help in this effort:</p>
<ul>
<li><strong><a href="https://modx.com/blog/recovering-from-a-hacked-site-part-1" class="inline-onebox">Recovering from a Hacked Site: Part 1</a></strong></li>
<li><strong><a href="https://modx.com/blog/recovering-from-a-hacked-site-part-2" class="inline-onebox">Recovering from a Hacked Site: Part 2</a></strong></li>
<li><strong><a href="https://modx.com/blog/recovering-from-a-hacked-site-part-3" class="inline-onebox">Recovering from a Hacked Site: Part 3</a></strong></li>
</ul>
<p><strong>Need Help?</strong><br>
If your web host, developer or sysadmin is not able to help, you can open a commercial support ticket directly with MODX by visiting <a href="https://support.modx.com/">https://support.modx.com</a> and clicking the blue “Submit a request” link in the header (please mention this post and provide your site URL). In order to assist we will need access to your server, most likely via your cPanel login.</p>
            <p><small>1 post - 1 participant</small></p>
            <p><a href="https://community.modx.com/t/modx-setup-directory-site-exploit/648">Read full topic</a></p>
          ";s:7:"attribs";a:0:{}s:8:"xml_base";s:0:"";s:17:"xml_base_explicit";b:0;s:8:"xml_lang";s:0:"";}}s:4:"link";a:1:{i:0;a:5:{s:4:"data";s:66:"https://community.modx.com/t/modx-setup-directory-site-exploit/648";s:7:"attribs";a:0:{}s:8:"xml_base";s:0:"";s:17:"xml_base_explicit";b:0;s:8:"xml_lang";s:0:"";}}s:7:"pubDate";a:1:{i:0;a:5:{s:4:"data";s:31:"Wed, 24 Apr 2019 15:36:05 +0000";s:7:"attribs";a:0:{}s:8:"xml_base";s:0:"";s:17:"xml_base_explicit";b:0;s:8:"xml_lang";s:0:"";}}s:4:"guid";a:1:{i:0;a:5:{s:4:"data";s:28:"community.modx.com-topic-648";s:7:"attribs";a:1:{s:0:"";a:1:{s:11:"isPermaLink";s:5:"false";}}s:8:"xml_base";s:0:"";s:17:"xml_base_explicit";b:0;s:8:"xml_lang";s:0:"";}}s:6:"source";a:1:{i:0;a:5:{s:4:"data";s:34:"MODX setup/ Directory Site Exploit";s:7:"attribs";a:1:{s:0:"";a:1:{s:3:"url";s:70:"https://community.modx.com/t/modx-setup-directory-site-exploit/648.rss";}}s:8:"xml_base";s:0:"";s:17:"xml_base_explicit";b:0;s:8:"xml_lang";s:0:"";}}}s:32:"http://purl.org/dc/elements/1.1/";a:1:{s:7:"creator";a:1:{i:0;a:5:{s:4:"data";s:7:"rthrash";s:7:"attribs";a:0:{}s:8:"xml_base";s:0:"";s:17:"xml_base_explicit";b:0;s:8:"xml_lang";s:0:"";}}}s:25:"http://www.discourse.org/";a:3:{s:11:"topicPinned";a:1:{i:0;a:5:{s:4:"data";s:2:"No";s:7:"attribs";a:0:{}s:8:"xml_base";s:0:"";s:17:"xml_base_explicit";b:0;s:8:"xml_lang";s:0:"";}}s:11:"topicClosed";a:1:{i:0;a:5:{s:4:"data";s:2:"No";s:7:"attribs";a:0:{}s:8:"xml_base";s:0:"";s:17:"xml_base_explicit";b:0;s:8:"xml_lang";s:0:"";}}s:13:"topicArchived";a:1:{i:0;a:5:{s:4:"data";s:2:"No";s:7:"attribs";a:0:{}s:8:"xml_base";s:0:"";s:17:"xml_base_explicit";b:0;s:8:"xml_lang";s:0:"";}}}}}i:2;a:6:{s:4:"data";s:130:"
          
          
          
          
          
          
          
          
          
          
          
        ";s:7:"attribs";a:0:{}s:8:"xml_base";s:0:"";s:17:"xml_base_explicit";b:0;s:8:"xml_lang";s:0:"";s:5:"child";a:3:{s:0:"";a:7:{s:5:"title";a:1:{i:0;a:5:{s:4:"data";s:35:"About the Security Notices category";s:7:"attribs";a:0:{}s:8:"xml_base";s:0:"";s:17:"xml_base_explicit";b:0;s:8:"xml_lang";s:0:"";}}s:8:"category";a:1:{i:0;a:5:{s:4:"data";s:16:"Security Notices";s:7:"attribs";a:0:{}s:8:"xml_base";s:0:"";s:17:"xml_base_explicit";b:0;s:8:"xml_lang";s:0:"";}}s:11:"description";a:1:{i:0;a:5:{s:4:"data";s:332:"
            <p>This is a subcategory of Announcements for Security Notices. Older security notices can be found in the archived MODX Forums.</p>
            <p><small>1 post - 1 participant</small></p>
            <p><a href="https://community.modx.com/t/about-the-security-notices-category/2264">Read full topic</a></p>
          ";s:7:"attribs";a:0:{}s:8:"xml_base";s:0:"";s:17:"xml_base_explicit";b:0;s:8:"xml_lang";s:0:"";}}s:4:"link";a:1:{i:0;a:5:{s:4:"data";s:69:"https://community.modx.com/t/about-the-security-notices-category/2264";s:7:"attribs";a:0:{}s:8:"xml_base";s:0:"";s:17:"xml_base_explicit";b:0;s:8:"xml_lang";s:0:"";}}s:7:"pubDate";a:1:{i:0;a:5:{s:4:"data";s:31:"Tue, 01 Jan 2013 05:00:00 +0000";s:7:"attribs";a:0:{}s:8:"xml_base";s:0:"";s:17:"xml_base_explicit";b:0;s:8:"xml_lang";s:0:"";}}s:4:"guid";a:1:{i:0;a:5:{s:4:"data";s:29:"community.modx.com-topic-2264";s:7:"attribs";a:1:{s:0:"";a:1:{s:11:"isPermaLink";s:5:"false";}}s:8:"xml_base";s:0:"";s:17:"xml_base_explicit";b:0;s:8:"xml_lang";s:0:"";}}s:6:"source";a:1:{i:0;a:5:{s:4:"data";s:35:"About the Security Notices category";s:7:"attribs";a:1:{s:0:"";a:1:{s:3:"url";s:73:"https://community.modx.com/t/about-the-security-notices-category/2264.rss";}}s:8:"xml_base";s:0:"";s:17:"xml_base_explicit";b:0;s:8:"xml_lang";s:0:"";}}}s:32:"http://purl.org/dc/elements/1.1/";a:1:{s:7:"creator";a:1:{i:0;a:5:{s:4:"data";s:11:"smashingred";s:7:"attribs";a:0:{}s:8:"xml_base";s:0:"";s:17:"xml_base_explicit";b:0;s:8:"xml_lang";s:0:"";}}}s:25:"http://www.discourse.org/";a:3:{s:11:"topicPinned";a:1:{i:0;a:5:{s:4:"data";s:2:"No";s:7:"attribs";a:0:{}s:8:"xml_base";s:0:"";s:17:"xml_base_explicit";b:0;s:8:"xml_lang";s:0:"";}}s:11:"topicClosed";a:1:{i:0;a:5:{s:4:"data";s:2:"No";s:7:"attribs";a:0:{}s:8:"xml_base";s:0:"";s:17:"xml_base_explicit";b:0;s:8:"xml_lang";s:0:"";}}s:13:"topicArchived";a:1:{i:0;a:5:{s:4:"data";s:2:"No";s:7:"attribs";a:0:{}s:8:"xml_base";s:0:"";s:17:"xml_base_explicit";b:0;s:8:"xml_lang";s:0:"";}}}}}}}s:27:"http://www.w3.org/2005/Atom";a:1:{s:4:"link";a:1:{i:0;a:5:{s:4:"data";s:0:"";s:7:"attribs";a:1:{s:0:"";a:3:{s:4:"href";s:66:"https://community.modx.com/c/announcements/security-notices/26.rss";s:3:"rel";s:4:"self";s:4:"type";s:19:"application/rss+xml";}}s:8:"xml_base";s:0:"";s:17:"xml_base_explicit";b:0;s:8:"xml_lang";s:0:"";}}}}}}}}}}}}s:4:"type";i:128;s:7:"headers";a:19:{s:12:"content-type";s:23:"text/xml; charset=utf-8";s:4:"vary";s:46:"Sec-Fetch-Dest, Sec-Fetch-Mode, Sec-Fetch-Site";s:13:"last-modified";s:28:"Sat, 5 Apr 2025 14:33:40 GMT";s:13:"cache-control";s:46:"no-cache, no-store, max-age=0, must-revalidate";s:6:"pragma";s:8:"no-cache";s:7:"expires";s:29:"Mon, 01 Jan 1990 00:00:00 GMT";s:4:"date";s:29:"Sat, 05 Apr 2025 18:52:03 GMT";s:9:"accept-ch";s:192:"Sec-CH-UA-Arch, Sec-CH-UA-Bitness, Sec-CH-UA-Full-Version, Sec-CH-UA-Full-Version-List, Sec-CH-UA-Model, Sec-CH-UA-WoW64, Sec-CH-UA-Form-Factors, Sec-CH-UA-Platform, Sec-CH-UA-Platform-Version";s:28:"cross-origin-resource-policy";s:9:"same-site";s:23:"content-security-policy";s:243:"script-src 'report-sample' 'nonce-I210TiogTkgzTWaN5JGi8A' 'unsafe-inline';object-src 'none';base-uri 'self';report-uri /_/RaichuFeedServer/cspreport;worker-src 'self', require-trusted-types-for 'script';report-uri /_/RaichuFeedServer/cspreport";s:18:"permissions-policy";s:174:"ch-ua-arch=*, ch-ua-bitness=*, ch-ua-full-version=*, ch-ua-full-version-list=*, ch-ua-model=*, ch-ua-wow64=*, ch-ua-form-factors=*, ch-ua-platform=*, ch-ua-platform-version=*";s:26:"cross-origin-opener-policy";s:11:"same-origin";s:19:"reporting-endpoints";s:168:"default=/_/RaichuFeedServer/web-reports?context=eJzj4tDikmII0JBiEOLhuPz96H42gQffVnUwKlkm5RfGJ5amZObrFpQm5WQWZ6QWFesCBXWLEjOTM0p101JTU4pTi8pSi-KNDIxMDUwMjPUMzOMLDACHmhv1";s:16:"content-encoding";s:4:"gzip";s:6:"server";s:3:"ESF";s:16:"x-xss-protection";s:1:"0";s:15:"x-frame-options";s:10:"SAMEORIGIN";s:22:"x-content-type-options";s:7:"nosniff";s:7:"alt-svc";s:42:"h3=:443; ma=2592000,h3-29=:443; ma=2592000";}s:5:"build";i:1743747377;s:21:"cache_expiration_time";i:1743882722;s:23:"__cache_expiration_time";i:1743882722;}