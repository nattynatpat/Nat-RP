let allowed = [
    "natounet21",
    "its_collintv_in_the_house"
]

function generate() {
    const fs = require("fs")
const data = JSON.parse(fs.readFileSync("data.json", 'utf8')).users
let dotfile = `digraph FamilyTree {
    node [shape=box];
    rankdir=TB;
    pad="0.5";
    node [shape=box, style="filled,rounded", fillcolor=lightblue, fontname=\"Helvetica\", shape=rect, rx=5];
    edge [fontname=\"Helvetica\", fontsize=20];`.split("\n")
let keys = Object.keys(data)
let nope = new Set()
for (let index = 0; index < keys.length; index++) {
    const key = keys[index];
    let mcdonald = data[key]

    let rela = Object.keys(mcdonald.relations)
    
    for (let index2 = 0; index2 < rela.length; index2++) {
        let rel = mcdonald.relations[rela[index2]]
        let type = rel.type
        let id = rel.id
        let stuff = `${data[id].name}-${mcdonald.name}`
        let stuff2 = `${mcdonald.name}-${data[id].name}`
        if (nope.has(stuff)&&nope.has(stuff2)) {
            continue;
        }
        switch (type) {
            case "child": {
                dotfile.push(`    "${mcdonald.name}" -> "${data[id].name}" [label=""];`);
                break;
            }
            case "parent": {
                dotfile.push(`    "${data[id].name}" -> "${mcdonald.name}" [label=""];`);
                break;
            }
            case "partner": {
                dotfile.push(`    "${mcdonald.name}" -> "${data[id].name}" [color=red, style=dashed, label="❤️", dir=none, penwidth=3];`);
                break;
            }
        }
        nope.add(stuff)
        nope.add(stuff2)
    }
}

dotfile.push("}")

fs.writeFileSync("butter.dot",dotfile.join("\n"))

require("child_process").execSync("dot -Tpng butter.dot -o family_tree.png")
}

const { SlashCommandBuilder, AttachmentBuilder, MediaGalleryBuilder, MessageFlags } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('family_tree')
        .setDescription('show the complete family tree!'),
    /**
* @param {import("discord.js").ChatInputCommandInteraction} interaction
*/
    async execute(interaction) {
        if (!allowed.includes(interaction.user.username)) {
            interaction.reply("you dont have da permission to use tat")
            return;
        }

        await interaction.deferReply()
        generate()

setTimeout(()=>{
    const file = new AttachmentBuilder('./family_tree.png');

const exampleGallery = new MediaGalleryBuilder().addItems(
	(mediaGalleryItem) =>
		mediaGalleryItem
			.setURL('attachment://family_tree.png'),
)

interaction.editReply({
	components: [exampleGallery],
    files: [file],
	flags: MessageFlags.IsComponentsV2,
});
},1000)
    },
};