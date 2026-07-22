(function() {
    'use strict';

    const SECURE_VAULT = {
        uToken: "bGFidWJ1bGFidWJ1X3NlY3VyZQ==",
        pToken: "bGFidWJ1MTIzbGFidWJ1MTIzbGFidWJ1MTIzX3NlY3VyZQ=="
    };

    const SALT_KEY = "_secure";

    window.addEventListener('DOMContentLoaded', () => {
        verificarAutenticacaoOuBloquear();
    });

    function decifrar(tokenCodificado) {
        try {
            const dec = atob(tokenCodificado);
            return dec.replace(SALT_KEY, '');
        } catch(e) {
            return "";
        }
    }

    function verificarAutenticacaoOuBloquear() {
        const logado = sessionStorage.getItem('studyos_auth_ok');
        if (logado === 'true') return;
        
        criarTelaLoginBloqueada();
    }

    function criarTelaLoginBloqueada() {
        const overlay = document.createElement('div');
        overlay.id = 'studyosLoginModal';
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: #020617; z-index: 999999; display: flex;
            align-items: center; justify-content: center; font-family: 'Segoe UI', Arial, sans-serif;
        `;

        overlay.innerHTML = `
            <div style="background: #0f172a; border: 2px solid #3b82f6; padding: 40px; border-radius: 16px; width: 100%; max-width: 400px; box-shadow: 0 25px 50px rgba(0,0,0,0.9); color: #f8fafc; text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 10px;">🔐</div>
                <h2 style="color: #3b82f6; margin-bottom: 5px; font-size: 1.5rem;">StudyOS - Acesso Seguro</h2>
                <p style="color: #94a3b8; font-size: 0.85rem; margin-bottom: 25px;">Insira suas credenciais criptografadas para continuar.</p>
                
                <div id="loginError" style="background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; color: #fca5a5; padding: 10px; border-radius: 6px; font-size: 0.8rem; margin-bottom: 15px; display: none;"></div>
                <div id="loginWarning" style="background: rgba(245, 158, 11, 0.1); border: 1px solid #f59e0b; color: #fbbf24; padding: 10px; border-radius: 6px; font-size: 0.8rem; margin-bottom: 15px; display: none;"></div>

                <form id="loginForm" onsubmit="window.validarLoginStudyOS(event)">
                    <div style="text-align: left; margin-bottom: 15px;">
                        <label style="font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; font-weight: bold; display: block; margin-bottom: 5px;">Usuário</label>
                        <input type="text" id="userInput" required autocomplete="off" style="width: 100%; padding: 12px; background: #1e293b; border: 1px solid #475569; border-radius: 8px; color: white; font-size: 1rem; box-sizing: border-box; outline: none;">
                    </div>
                    <div style="text-align: left; margin-bottom: 25px;">
                        <label style="font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; font-weight: bold; display: block; margin-bottom: 5px;">Senha</label>
                        <input type="password" id="passInput" required autocomplete="off" style="width: 100%; padding: 12px; background: #1e293b; border: 1px solid #475569; border-radius: 8px; color: white; font-size: 1rem; box-sizing: border-box; outline: none;">
                    </div>
                    <button type="submit" id="submitBtn" style="width: 100%; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; border: none; padding: 12px; border-radius: 8px; font-weight: bold; cursor: pointer; text-transform: uppercase; font-size: 0.9rem; transition: 0.2s;">Entrar no Sistema</button>
                </form>
            </div>
        `;

        document.body.appendChild(overlay);
        verificarBloqueio10Minutos();
    }

    function verificarBloqueio10Minutos() {
        const blockTime = localStorage.getItem('studyos_lock_until');
        if (blockTime) {
            const agora = new Date().getTime();
            if (agora < parseInt(blockTime)) {
                const minutos = Math.ceil((parseInt(blockTime) - agora) / (1000 * 60));
                aplicarEstadoBloqueado(minutos);
            } else {
                localStorage.removeItem('studyos_lock_until');
                localStorage.removeItem('studyos_err_count');
            }
        }
    }

    function aplicarEstadoBloqueado(minutos) {
        const btn = document.getElementById('submitBtn');
        const usr = document.getElementById('userInput');
        const pwd = document.getElementById('passInput');
        const warn = document.getElementById('loginWarning');

        if (btn) btn.disabled = true;
        if (usr) usr.disabled = true;
        if (pwd) pwd.disabled = true;
        if (warn) {
            warn.style.display = 'block';
            warn.innerText = `Muitas tentativas incorretas. Acesso bloqueado por segurança. Tente novamente em ${minutos} minuto(s).`;
        }
    }

    window.validarLoginStudyOS = function(event) {
        event.preventDefault();

        const blockTime = localStorage.getItem('studyos_lock_until');
        if (blockTime && new Date().getTime() < parseInt(blockTime)) return;

        const userVal = document.getElementById('userInput').value.trim();
        const passVal = document.getElementById('passInput').value.trim();
        const errorBox = document.getElementById('loginError');

        const realUser = decifrar(SECURE_VAULT.uToken);
        const realPass = decifrar(SECURE_VAULT.pToken);

        if (userVal === realUser && passVal === realPass) {
            localStorage.removeItem('studyos_err_count');
            localStorage.removeItem('studyos_lock_until');
            sessionStorage.setItem('studyos_auth_ok', 'true');

            const modal = document.getElementById('studyosLoginModal');
            if (modal) {
                modal.style.transition = 'opacity 0.4s ease';
                modal.style.opacity = '0';
                setTimeout(() => modal.remove(), 400);
            }
        } else {
            let erros = parseInt(localStorage.getItem('studyos_err_count') || '0') + 1;
            localStorage.setItem('studyos_err_count', erros);

            if (erros >= 3) {
                const tempoBloqueio = new Date().getTime() + (10 * 60 * 1000);
                localStorage.setItem('studyos_lock_until', tempoBloqueio);
                aplicarEstadoBloqueado(10);
            } else {
                const restantes = 3 - erros;
                errorBox.style.display = 'block';
                errorBox.innerText = `Credenciais incorretas! Restam ${restantes} tentativa(s) antes do bloqueio de 10 minutos.`;
            }
        }
    };

})();