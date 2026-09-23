#!/bin/bash
# El sitio estático viejo (GitHub Pages) seguía publicado con «palapa», «Tiki Hut»
# y el texto de antes, duplicando al sitio bueno. Cada página pasa a ser una
# redirección a su equivalente en clubwynwood.com (Daniel, 22-sep: «quita la
# palabra palapa de todo»). El sitio viejo entero sigue en el historial de git.
set -e
cd /home/daniel/club-wynwood-web
N=https://clubwynwood.com
stub () { # $1 archivo  $2 destino
  cat > "$1" <<HTML
<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Club Wynwood — Jardín de eventos al aire libre en Wynwood, Miami</title>
<link rel="canonical" href="$2">
<meta name="robots" content="noindex, follow">
<meta http-equiv="refresh" content="0; url=$2">
<script>location.replace("$2" + location.search + location.hash);</script>
</head>
<body>
<p>Club Wynwood está en <a href="$2">clubwynwood.com</a>.</p>
</body>
</html>
HTML
  echo "  $1 → $2"
}
stub index.html                      "$N/es"
stub el-jardin/index.html            "$N/es/el-jardin"
stub tiki-hut/index.html             "$N/es/el-pabellon"
stub bodas/index.html                "$N/es/bodas"
stub eventos-corporativos/index.html "$N/es/eventos-corporativos"
stub produccion-y-rodajes/index.html "$N/es/produccion-y-rodajes"
stub preguntas-frecuentes/index.html "$N/es/preguntas-frecuentes"
printf 'Club Wynwood vive en https://clubwynwood.com\nLa ficha para modelos de lenguaje está en https://clubwynwood.com/llms.txt\n' > llms.txt
printf 'User-agent: *\nAllow: /\nSitemap: https://clubwynwood.com/sitemap.xml\n' > robots.txt
git rm -q --cached sitemap.xml 2>/dev/null && rm -f sitemap.xml || true
echo "── ¿queda «palapa» o «Tiki Hut» en lo publicado?"
grep -rliE 'palapa|tiki hut' --include=*.html --include=*.txt --include=*.xml . | grep -v '^./.git' || echo "  nada"
