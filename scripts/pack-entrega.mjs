/**
 * Monta o zip de entrega.
 *
 * `git archive` sozinho não serve: ele empacota só o que está versionado, e o
 * `.env.local` é ignorado de propósito. Como a entrega vai por email e quem
 * recebe precisa rodar sem criar conta em lugar nenhum, o arquivo entra no zip
 * — mas continua fora do repositório.
 *
 * O fluxo é: exportar o HEAD para uma pasta temporária, copiar o `.env.local`
 * para dentro e compactar. Assim o conteúdo versionado sai exatamente como está
 * no commit, sem `node_modules`, sem `.next` e sem lixo local.
 */

import { execFileSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const PREFIX = 'olyra-crm'
const OUTPUT = 'olyra-crm.zip'
const ENV_FILE = '.env.local'

function run(command, args) {
  execFileSync(command, args, { stdio: 'inherit' })
}

if (!existsSync(ENV_FILE)) {
  console.error(`Faltou o ${ENV_FILE}. Ele é o que permite rodar o projeto sem configurar nada.`)
  process.exit(1)
}

const staging = mkdtempSync(join(tmpdir(), 'olyra-pack-'))

try {
  const tarball = join(staging, 'head.tar')

  run('git', ['archive', '--format=tar', `--prefix=${PREFIX}/`, '-o', tarball, 'HEAD'])
  run('tar', ['-x', '-f', tarball, '-C', staging])
  rmSync(tarball)

  copyFileSync(ENV_FILE, join(staging, PREFIX, ENV_FILE))

  rmSync(OUTPUT, { force: true })

  // `Compress-Archive` já vem no Windows; em Linux e macOS o `zip` resolve.
  if (process.platform === 'win32') {
    run('powershell', [
      '-NoProfile',
      '-Command',
      `Compress-Archive -Path '${join(staging, PREFIX)}' -DestinationPath '${join(process.cwd(), OUTPUT)}'`,
    ])
  } else {
    run('sh', ['-c', `cd '${staging}' && zip -qr '${join(process.cwd(), OUTPUT)}' '${PREFIX}'`])
  }

  console.log(`\n${OUTPUT} pronto — inclui o ${ENV_FILE}.`)
} finally {
  rmSync(staging, { recursive: true, force: true })
}
