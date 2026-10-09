from PIL import Image
HAIR = [(216,128,84),(181,107,70),(142,84,55)]
SKIN = [(247,224,207),(255,232,214)]
SHIRT = [(173,61,53),(142,52,44),(107,38,33)]
PANTS = [(17,165,224),(15,139,188)]
def shades(base, k=(1.0, 0.82, 0.62)):
    return [tuple(min(255, int(c*f)) for c in base) for f in k]
variants = {
    'elder':   dict(hair=shades((210,210,205)), shirt=shades((120,86,50)),  pants=shades((90,70,45))),
    'smith':   dict(hair=shades((60,40,30)),    shirt=shades((95,95,100)),  pants=shades((80,60,40))),
    'trader':  dict(hair=shades((40,30,25)),    shirt=shades((60,120,70)),  pants=shades((190,160,110))),
    'seer':    dict(hair=shades((235,235,235)), shirt=shades((110,60,150)), pants=shades((70,40,100))),
    'child':   dict(hair=shades((235,200,90)),  shirt=shades((80,150,90)),  pants=shades((150,110,70))),
    'farmer':  dict(hair=shades((120,80,50)),   shirt=shades((130,140,70)), pants=shades((100,80,55))),
    'warrior': dict(hair=shades((150,60,40)),   shirt=shades((130,130,140)),pants=shades((80,40,40))),
    'legion':  dict(hair=shades((70,50,35)),    shirt=shades((160,160,170)),pants=shades((170,50,50))),
    'woman':   dict(hair=shades((90,60,40)),    shirt=shades((190,120,150)),pants=shades((120,90,130))),
    'monk':    dict(hair=shades((100,100,100)), shirt=shades((60,50,45)),   pants=shades((60,50,45))),
}
for name, pal in variants.items():
    for d in ['down', 'up']:
        im = Image.open(f'public/assets/img/player_sprite_{d}.png').convert('RGBA')
        px = im.load()
        mp = {}
        for i, c in enumerate(HAIR): mp[c] = pal['hair'][i]
        for i, c in enumerate(SHIRT): mp[c] = pal['shirt'][i]
        for i, c in enumerate(PANTS): mp[c] = pal['pants'][min(i, 2)]
        for y in range(im.height):
            for x in range(im.width):
                r, g, b, a = px[x, y]
                if (r, g, b) in mp and a > 0:
                    px[x, y] = mp[(r, g, b)] + (a,)
        if name == 'child':
            im = im.resize((13, 16), Image.NEAREST)
        im.save(f'public/assets/img/npc_{name}_{d}.png')
print('ok', len(variants))
