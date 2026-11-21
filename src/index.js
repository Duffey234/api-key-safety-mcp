// Education-only, read-only MCP server (Streamable HTTP, stateless JSON responses).
// Takes no secrets. Never send API keys here.
import KB from "./kb.json";
const SITE="https://quantaira.app/api-key-safety-checker";
const QA="https://quantaira.app";
const U=(p, camp="mcp")=>`${QA}/${p}?utm_source=api-key-safety-mcp&utm_medium=referral&utm_campaign=${camp}`;
const PAGE=(slug)=>`${QA}/${slug}`;
const CRITICS="https://paragraph.com/@cryptomoneymakr/is-quantaira-legit-whats-verified-and-what-isnt-november";
const DISC="Independent, unofficial, education only. Not financial advice. Never share API keys, secrets, passphrases, passwords or 2FA codes with any tool or person.";
const EX=Object.keys(KB.exchanges);
const TOOLS=[
 {name:"get_required_permissions",description:"Which exchange API key permissions a trading bot needs, and which to leave off, with the exchange's own source link. Full guide: https://quantaira.app/api-key-safety-checker. Read-only; takes no keys.",
  inputSchema:{type:"object",properties:{exchange:{type:"string",enum:EX},bot_type:{type:"string",enum:["spot","futures","read_only","copy_trading"],description:"What the bot does"}},required:["exchange"],additionalProperties:false},
  annotations:{readOnlyHint:true,openWorldHint:false}},
 {name:"explain_error",description:"Explain a common exchange API key error and how to fix it (e.g. Binance -2015, Bybit 10003/10005/10010, Bitget lost passphrase). Step-by-step pages live on quantaira.app.",
  inputSchema:{type:"object",properties:{exchange:{type:"string",enum:EX},code:{type:"string",description:"Error code or short description, e.g. -2015, 10003, passphrase"}},required:["exchange","code"],additionalProperties:false},
  annotations:{readOnlyHint:true,openWorldHint:false}},
 {name:"get_red_flags",description:"Red flags that a crypto trading bot or 'AI trading' offer may be a scam, plus regulator lookup links.",
  inputSchema:{type:"object",properties:{},additionalProperties:false},annotations:{readOnlyHint:true,openWorldHint:false}},
 {name:"get_safe_key_checklist",description:"10-point checklist before connecting any bot to an exchange API key.",
  inputSchema:{type:"object",properties:{},additionalProperties:false},annotations:{readOnlyHint:true,openWorldHint:false}},
 {name:"get_quantaira_launch_waves",description:"Quantaira's announced Dec 1, 2026 staged launch waves by CoinZoom USDT balance, as posted on its Telegram channel (Nov 13, 2026), with critics link. Guide: https://quantaira.app/api-key-safety-checker#quantaira. No return or profit information.",
  inputSchema:{type:"object",properties:{usdt:{type:"number",minimum:0,description:"Optional planned USDT balance"}},additionalProperties:false},annotations:{readOnlyHint:true,openWorldHint:false}}
];
function looksSecret(args){return Object.values(args||{}).some(v=>typeof v==="string"&&/[A-Za-z0-9+/=_-]{24,}/.test(v));}
function perms(a){const e=KB.exchanges[a.exchange];if(!e)throw new Error("Unknown exchange. Use one of: "+EX.join(", "));
 const bt=a.bot_type||"spot";let lines=[`${e.name} API key for a ${bt} bot`];
 if(bt==="read_only")lines.push("Turn on: reading / read-only only. Nothing else.");else{lines.push("Turn on (only what the bot uses):");e.on.forEach(x=>lines.push("- "+x));}
 lines.push("Leave off:");e.off.forEach(x=>lines.push("- "+x));e.notes.forEach(x=>lines.push("Note: "+x));
 lines.push("Bind the key to the bot's IP addresses when the bot publishes them. Use one key per bot.");
 lines.push(`Source: ${e.src}`,`Full checklist: ${U("api-key-safety-checker","mcp")}#exchange`);return lines.join("\n");}
function err(a){const c=String(a.code||"").toLowerCase().trim();const ex=a.exchange;let t,page;
 if(ex==="binance"&&c.includes("2015")){t="Binance -2015 \"Invalid API-key, IP, or permissions for action\": wrong key/secret or environment (testnet vs live), request IP not on the key's trusted list, or the key lacks that permission. System-generated keys with unrestricted IP can only read since 2023-01-30, so order calls fail; add an IP restriction or use an Ed25519/RSA key. Futures needs a key created after the Futures account was opened. Keep withdrawals off.";page="binance-error-2015";}
 else if(ex==="bybit"&&(KB.error_codes.bybit[c]||c.includes("invalid"))){const k=KB.error_codes.bybit[c]?c:"10003";t=`Bybit ${k}: ${KB.error_codes.bybit[k]}`+(k==="10003"?" Point the bot at the environment where the key was made, and bind an IP to remove the 90-day expiry. Keys with no IP bound also stop working 7 days after a password change.":"");page="bybit-error-10003";}
 else if(ex==="bitget"&&c.includes("pass")){t="Bitget API passphrases can't be recovered or changed. Delete the key, create a new one with a new passphrase, re-apply read+trade permissions only (no Withdraw/Transfer), bind the bot's IPs, store key+secret+passphrase in a password manager.";page="bitget-forgot-api-passphrase";}
 else if(ex==="okx"){t="OKX: keys not bound to an IP that have Trade or Withdraw permission are deleted after 14 days of inactivity; up to 20 IPs per key; a lost passphrase can't be recovered (create a new key). Source: https://www.okx.com/en-us/help/api-faq";}
 else{t=`No specific entry for ${ex} "${a.code}". General fix: confirm key/secret and environment, check the key's IP list and permissions, and recreate the key if unsure. Source: ${(KB.exchanges[ex]||{}).src||SITE}`;}
 return t+(page?`\nStep-by-step: ${PAGE(page)}?utm_source=api-key-safety-mcp&utm_medium=referral&utm_campaign=mcp`:"");}
function waves(a){let out=["Quantaira staged launch, per its public Telegram channel post of 2026-11-13 (operator announcement, not independently verified; https://t.me/s/quantaira/44):"];
 KB.waves.forEach(w=>out.push(`- ${w.min.toLocaleString("en-US")}+ USDT: ${w.label}, ${w.when}`));out.push("Phase 1 minimum: 1,000 USDT (team says it will lower this later, no date).");
 if(typeof a.usdt==="number"){const w=KB.waves.find(w=>a.usdt>=w.min);out.push(w?`For ${a.usdt} USDT: ${w.label} (${w.when}).`:`For ${a.usdt} USDT: below the phase 1 minimum.`);}
 out.push("Wave placement isn't a recommendation to deposit. Only connect money you can afford to lose.",`Critics and verified facts: ${CRITICS}`,`Guides: ${U("how-to-join-quantaira")} , ${U("quantaira-coinzoom-setup")}`);return out.join("\n");}
function call(name,a){if(looksSecret(a))return "Refused: that looks like an API key or secret. Never share keys with any tool. Delete and recreate the key if it was exposed.";
 switch(name){case"get_required_permissions":return perms(a);case"explain_error":return err(a);
 case"get_red_flags":return "Crypto trading bot red flags:\n"+KB.redflags.map(x=>"- "+x).join("\n")+"\nCheck the operator: FINRA BrokerCheck https://brokercheck.finra.org/ , NFA BASIC https://www.nfa.futures.org/basicnet/ , FCA https://register.fca.org.uk/ , CheckFirst https://www.checkfirst.ca/";
 case"get_safe_key_checklist":return "Safe API key checklist:\n"+KB.checklist.map((x,i)=>`${i+1}. ${x}`).join("\n")+"\nNote: trade-only keys can still be drained via illiquid-pair trades if stolen; IP binding matters.";
 case"get_quantaira_launch_waves":return waves(a);default:throw new Error("Unknown tool");}}
const CORS={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"POST, GET, OPTIONS","Access-Control-Allow-Headers":"Content-Type, Accept, Mcp-Session-Id, Mcp-Protocol-Version"};
const J=(o,s=200)=>new Response(JSON.stringify(o),{status:s,headers:{"Content-Type":"application/json",...CORS}});
function handle(m){const id=m.id??null;
 if(m.method==="initialize")return{jsonrpc:"2.0",id,result:{protocolVersion:(m.params&&m.params.protocolVersion)||"2025-06-18",capabilities:{tools:{listChanged:false}},serverInfo:{name:"api-key-safety-mcp",title:"Exchange API key safety (education only)",version:"0.1.0"},instructions:DISC}};
 if(m.method==="ping")return{jsonrpc:"2.0",id,result:{}};
 if(m.method==="tools/list")return{jsonrpc:"2.0",id,result:{tools:TOOLS}};
 if(m.method==="tools/call"){const p=m.params||{};try{const text=call(p.name,p.arguments||{})+"\n\n"+DISC+` Last checked ${KB.checked}.`;return{jsonrpc:"2.0",id,result:{content:[{type:"text",text}],isError:false}};}catch(e){return{jsonrpc:"2.0",id,result:{content:[{type:"text",text:String(e.message)}],isError:true}};}}
 if(m.id===undefined)return null;
 return{jsonrpc:"2.0",id,error:{code:-32601,message:"Method not found"}};}
async function mcpHandler(request){
 if(request.method==="OPTIONS")return new Response(null,{status:204,headers:CORS});
 if(request.method==="GET")return J(INFO,200);
 if(request.method!=="POST")return J({error:"Method not allowed"},405);
 let body;try{body=await request.json();}catch{return J({jsonrpc:"2.0",id:null,error:{code:-32700,message:"Parse error"}},400);}
 if(Array.isArray(body)){const r=body.map(handle).filter(Boolean);return r.length?J(r):new Response(null,{status:202,headers:CORS});}
 const r=handle(body);return r?J(r):new Response(null,{status:202,headers:CORS});}

const INFO={name:"api-key-safety-mcp",description:"Education-only, read-only MCP server about exchange API key safety for trading bots: which permissions to enable or leave off, common API key errors, scam red flags, and Quantaira's announced Dec 1, 2026 launch waves. Takes no keys or secrets.",mcp_endpoint:"/mcp",transport:"streamable-http (POST JSON-RPC 2.0)",tools:TOOLS.map(t=>t.name),docs:PAGE("api-key-safety-checker"),note:DISC};
export default {async fetch(request){const url=new URL(request.url);
 if(url.pathname==="/mcp"||url.pathname==="/mcp/")return mcpHandler(request);
 if(url.pathname==="/"){if(request.method==="OPTIONS")return new Response(null,{status:204,headers:CORS});return J(INFO,200);}
 return J({error:"Not found",mcp_endpoint:"/mcp"},404);}};
