using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RenanRolo.NgCoreChat.Hubs
{
    public class ChatHub : Hub
    {
        public void Entrar(string nome, string avatarId)
        {
            Usuario usuarioEntrou = UsuariosLogados.Adicionar(Context.ConnectionId, nome, Convert.ToInt32(avatarId));

            Clients.Caller.SendAsync("Usuarios", UsuariosLogados.Todos);
            Clients.Caller.SendAsync("EntrarNoChat", usuarioEntrou);

            Clients.All.SendAsync("UsuarioEntrou", usuarioEntrou);
        }

        public void ObterMeuUsuario()
        {
            Usuario usuario = UsuariosLogados.Todos.SingleOrDefault(x => x.ContextoId == Context.ConnectionId);
            Clients.Caller.SendAsync("ObterMeuUsuario", usuario);
        }

        public void Sair()
        {
            UsuariosLogados.Remover(Context.ConnectionId);
            Clients.All.SendAsync("Usuarios", UsuariosLogados.Todos);
        }

        public void EnviarMensagem(string mensagem, int paraUsuarioId)
        {
            Usuario de = UsuariosLogados.Todos.SingleOrDefault(x => x.ContextoId == Context.ConnectionId);

            Usuario para = UsuariosLogados.Todos.SingleOrDefault(x => x.UsuarioId == paraUsuarioId);

            Clients.Client(para.ContextoId).SendAsync("ReceberMensagem", new
            {
                de.UsuarioId,
                mensagem
            });
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            Usuario usuario = UsuariosLogados.Desconectar(Context.ConnectionId);

            if (usuario != null)
            {
                Clients.All.SendAsync("UsuarioDesconectou", usuario.UsuarioId);
            }

            await base.OnDisconnectedAsync(exception);
        }
    }

    public static class UsuariosLogados
    {
        private static List<Usuario> Usuarios = new List<Usuario>();

        public static List<Usuario> Todos
        {
            get
            {
                return Usuarios;
            }
        }

        public static Usuario Adicionar(string contextoId, string nome, int avatarId)
        {
            int maxId = Todos.Any()
                            ? Todos.Max(x => x.UsuarioId)
                            : 0;

            int usuarioId = maxId + 1;

            Usuario usuario = new Usuario(usuarioId, contextoId, nome, avatarId, true);

            Usuarios.Add(usuario);

            return usuario;
        }

        public static void Remover(string usuarioId)
        {
            Usuario usuarioIn = UsuariosLogados.Usuarios.SingleOrDefault(x => x.ContextoId == usuarioId);
            UsuariosLogados.Usuarios.Remove(usuarioIn);
        }

        internal static Usuario Desconectar(string connectionId)
        {
            Usuario usuario = UsuariosLogados.Todos.SingleOrDefault(x => x.ContextoId == connectionId);
            if (usuario != null)
            {
                usuario.Desconectar();
            }

            return usuario;
        }
    }

    public class Usuario
    {
        public Usuario(int usuarioId, string contextoId, string nome, int avatarId, bool conectado)
        {
            UsuarioId = usuarioId;
            ContextoId = contextoId;
            Nome = nome;
            AvatarId = avatarId;
            Conectado = conectado;
        }

        public int UsuarioId { get; private set; }
        public string ContextoId { get; private set; }
        public string Nome { get; private set; }
        public int AvatarId { get; private set; }
        public bool Conectado { get; private set; }

        public void Desconectar()
        {
            Conectado = false;
        }
    }
}
