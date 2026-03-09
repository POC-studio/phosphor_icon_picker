function u(n,m){if(!document.getElementById("emoji-picker-script")){const r=document.createElement("script");r.id="emoji-picker-script",r.type="module",r.src="https://unpkg.com/emoji-picker-element",document.head.appendChild(r)}const i=document.createElement("div");i.style.position="relative",i.style.width="100%",i.style.height="100%",i.style.display="flex",i.style.alignItems="center",i.style.justifyContent="center",i.style.fontFamily="sans-serif",n.data.currentSize=32,n.data.returnFormat="emoji",n.data.searchPlaceholder="Search...";const t=document.createElement("span");t.textContent="🙂",t.style.fontSize=`${n.data.currentSize}px`,t.style.cursor="pointer",t.style.display="flex",t.style.alignItems="center",t.style.justifyContent="center",t.style.width="100%",t.style.height="100%",t.style.lineHeight="1",t.style.transform="translateY(0.09em)",t.style.borderRadius="8px",t.style.transition="background-color 0.2s",t.style.opacity="0.5",t.onmouseover=()=>t.style.backgroundColor="#f3f4f6",t.onmouseout=()=>t.style.backgroundColor="transparent",i.appendChild(t);const e=document.createElement("div");e.style.position="absolute",e.style.top="100%",e.style.left="0",e.style.marginTop="0px",e.style.display="none",e.style.zIndex="1000",e.style.boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",e.style.borderRadius="8px",e.style.overflow="hidden",e.style.border="1px solid #e5e7eb",e.style.backgroundColor="#ffffff";const o=document.createElement("emoji-picker");o.style.setProperty("--background","#ffffff"),o.style.setProperty("--border-color","transparent"),o.style.setProperty("--border-radius","8px"),o.style.setProperty("--indicator-color","#3b82f6"),o.style.setProperty("--input-border-color","#d1d5db"),o.style.setProperty("--input-border-radius","4px"),o.style.setProperty("--input-padding","8px"),o.style.setProperty("--input-font-size","14px"),o.style.setProperty("--outline-color","#3b82f6"),o.style.setProperty("--category-font-size","12px"),o.style.setProperty("--category-font-color","#6b7280"),o.style.setProperty("--emoji-padding","6px"),o.style.boxShadow="none",customElements.whenDefined("emoji-picker").then(()=>{if(o.shadowRoot){const r=document.createElement("style");r.textContent=`
        /* Nettoyage du header pour qu'il soit fluide */
        
        .search-row {
          padding: 8px !important;
          background-color: #f9fafb !important;
          border-bottom: 1px solid #e5e7eb !important;
          margin: 0 !important;
          border-radius: 8px 8px 0 0 !important;
        }

        /* Ajuster la barre de recherche */
        .search-wrapper {
          display: flex !important;
          align-items: center !important;
          position: relative !important;
          margin: 0 !important;
          width: 100% !important;
        }

        .search-icon {
          display: none !important;
        }

        input.search {
          background-color: #ffffff !important;
          border: 1px solid #d1d5db !important;
          border-radius: 4px !important;
          padding: 8px !important;
          font-size: 14px !important;
          outline: none !important;
          box-shadow: none !important;
          width: 100% !important;
          box-sizing: border-box !important;
          color: #1f2937 !important;
          font-family: inherit !important;
          transition: border-color 0.2s !important;
          margin: 0 !important;
        }

        input.search::placeholder {
          color: #9ca3af !important;
          opacity: 1 !important;
        }

        input.search:focus {
          border-color: #3b82f6 !important;
        }
        
        /* Affichage des catégories */
        .nav {
          background-color: #ffffff !important;
          border-radius: 0 !important;
          padding: 4px 8px 0 8px !important;
          border-bottom: 1px solid #e5e7eb !important;
          margin: 0 !important;
        }

        /* Aligner parfaitement le soulignement bleu (tab selected)
           avec les emojis au-dessus : même padding gauche/droite */
        .indicator {
          margin: 0 8px !important;
        }

        /* Masquer la div de padding qui crée un espace blanc gênant en haut */
        .pad-top {
          display: none !important;
        }

        /* Masquer TOTALEMENT la couleur de peau */
        #skintone-button, .skintone-button-wrapper {
          display: none !important;
        }

        /* Masquer la ligne tout en bas (favorites / recently used) */
        .favorites {
          display: none !important;
        }
      `,o.shadowRoot.appendChild(r)}if(typeof o.setPreferredSkinTone=="function")try{o.setPreferredSkinTone(0)}catch{}}),e.appendChild(o),document.body.appendChild(e),t.addEventListener("click",r=>{r.stopPropagation();const s=e.style.display==="none";if(s){const p=t.getBoundingClientRect();e.style.top=`${p.bottom+window.scrollY}px`,e.style.left=`${p.left+window.scrollX}px`,e.style.display="block";const a=l=>{l&&typeof l.setPreferredSkinTone=="function"&&l.setPreferredSkinTone(0).catch(()=>{})};a(o),a(o.database),setTimeout(()=>{var d;const l=(d=o.shadowRoot)==null?void 0:d.querySelector("input.search");l&&(n.data.searchPlaceholder&&(l.placeholder=n.data.searchPlaceholder),l.focus())},50)}else e.style.display="none";n.publishState("is_open",s)}),document.addEventListener("click",r=>{e.contains(r.target)||e.style.display!=="none"&&(e.style.display="none",n.publishState("is_open",!1))}),window.addEventListener("scroll",()=>{e.style.display!=="none"&&(e.style.display="none",n.publishState("is_open",!1))},!0);const c=r=>r&&r.replace(/[\u{1F3FB}-\u{1F3FF}]/gu,""),y=r=>r&&r.replace(/-1F3F[B-F]$/i,"");o.addEventListener("emoji-click",r=>{const s=r.detail,p=c(s.unicode);t.textContent=p,t.style.opacity="1";let a=p;n.data.returnFormat==="hexcode"?a=y(s.hexcode||""):n.data.returnFormat==="shortcode"&&(s.shortcodes&&s.shortcodes.length>0?a=s.shortcodes[0]:a=p),n.publishState("selected_emoji",a),n.triggerEvent("emoji_selected"),e.style.display="none",n.publishState("is_open",!1)}),n.canvas.append(i),n.data.mainEmoji=t,n.data.pickerElement=o}export{u as default};
