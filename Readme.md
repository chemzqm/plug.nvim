# Plug.nvim

[![](http://img.shields.io/github/issues/neoclide/plug.nvim.svg)](https://github.com/neoclide/plug.nvim/issues)
[![](http://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

![2018-04-03 18_14_46](https://user-images.githubusercontent.com/251450/38243892-84d95fce-376b-11e8-90a9-573decb1c481.gif)

None block plugin manager for neovim.

Could works for vim (without commands support).

## Features

- Async and run git commands in parallel
- Quick remap for view update logs and diffs
- Run `UpdateRemotePlugins` command and generate helptags when necessary
- No cache, no magic
- Unlike [vim-plug](https://github.com/junegunn/vim-plug), always manage update
  of itself.

## Install

[neovim](https://github.com/neovim/neovim) > 0.2.2 is required for node provider
to work.

[Node.js](https://nodejs.org/en/) is required, after node installed, run command
like:

```
git clone https://github.com/chemzqm/plug.nvim.git ~/.vim/bundle
cd ~/.vim/bundle/plug.nvim
npm install
```

Node version > 8 is required.

## Usage

```viml
" change runtimepath is required
set runtimepath^=~/.vim/bundle/plug.nvim
call plug#begin()
Plug 'chemzqm/wxapp.vim', {'dir': '~/vim-dev', 'frozen': 1}
Plug 'Shougo/echodoc.vim'
" should only be used after all plugins added by Plug command
call plug#end()

filetype plugin indent on
syntax on
```

## Variables

- `g:plug_shadow`: use shadow clone(--depth=1) for git repos, set to `0` to disable it
- `g:plug_threads`: the number of parallel threads for update/install, default to `8`
- `g:plug_timeout`: timeout in seconds of each update/install command, default to `60`
- `g:plug_rebase`: use rebase (git pull --rebase --autostash) for update, default to `0`
- `g:plug_url_format`: format string for git remote location, default:
  `https://github.com/%s.git`

## Keymaps

- `r` retry update of underline plugin
- `q` quit current buffer
- `l` show update/install log of underline plugin in preview window
- `d` show latest update diff of underline plugin in preview window
- `t` open iterm2 with new tab at root of underline plugin
- `gl` run `Denite gitlog` in plugin directory, requires [denite-git](https://github.com/neoclide/denite-git)

## Functions

### `plug#begin([root])`

A function that should be called before any Plug command.
You can specify a optional `root` directory for all your plugins, it's default
to `$VIM."/vimfiles/bundle"` on windows and `~/.vim/bundle` on Mac/Linux.

### `plug#end()`

A function that should be called after all Plug command.

## Commands

### `Plug 'user/repo', option`

Plug.nvim only support install plugins from **github**.

`option` is a vim dictionary, it could contain following fields:

- `as` specify an alias name for plugin folder to avoid conflict
- `dir` custom parent directory for this plugin
- `frozen` not run update or install for this plugin when is `1`
- `do` shell command that would be run in plugin folder after install/update
- `branch/tag/commit` Branch/tag/commit of the repository to use

**Notice** no lazyload stuff would be available, it's useless for neovim.

### `PlugUpdate`

Update/install all plugins.

### `PlugUpdate [plugin]`

Update/install a specific plugin, use `tab` to complete plugin name.

### `PlugRemove [plugin]`

Remove plugin folder to trash.

### `Denite vim`

Open denite source for vim. Support `tabopen` `update` `delete` action.
