function range(start: number, stop: number, step: number = 1): number[] {
	let a = [start],
		b = start
	while (b < stop) {
		a.push((b += step))
	}
	return a
}

function linear(text: string, width: number) {
	const words = text.split(" ")
	const count = words.length
	let offsets = [0]

	for (const word of words) {
		offsets.push(offsets[offsets.length - 1] + word.length)
	}

	let minima: number[] = ([] as number[]).concat(
		[0],
		[...new Array(count)].fill(10 ** 20)
	)
	let breaks = [...new Array(count + 1)].fill(0)

	function cost(i: number, j: number) {
		const w = offsets[j] - offsets[i] + j - i - 1

		if (w > width) return 10 ** 10 * (w - width)
		return minima[i] + (width - w) ** 2
	}

	function smawk(rows: number[], columns: number[]) {
		let stack = []
		let i = 0

		while (i < rows.length) {
			if (stack.length > 0) {
				let c = columns[stack.length - 1]

				if (cost(stack[stack.length - 1], c) < cost(rows[i], c)) {
					if (stack.length < columns.length) {
						stack.push(rows[i])
					}
					++i
				} else {
					stack.pop()
				}
			} else {
				stack.push(rows[i])
				++i
			}
		}

		rows = stack

		if (columns.length > 1) {
			smawk(rows, columns.slice(1, 3))
		}

		let j = (i = 0)

		while (j < columns.length) {
			let end: number
			if (j + 1 < columns.length) {
				end = breaks[columns[j + 1]]
			} else {
				end = rows[rows.length - 1]
			}

			let c = cost(rows[i], columns[j])

			if (c < minima[columns[j]]) {
				minima[columns[j]] = c
				breaks[columns[j]] = rows[i]
			}

			if (rows[i] < end) {
				++i
			} else {
				j += 2
			}
		}
	}

	let n = count + 1
	let i = 0
	let offset = 0

	while (true) {
		let r = Math.min(n, 2 ** (i + 1))
		let edge = 2 ** i + offset
		smawk(range(0 + offset, edge), range(edge, r + offset))
		let x = minima[r - 1 + offset]

		loop: {
			for (const j of range(2 ** i, r - 1)) {
				let y = cost(j + offset, r - 1 + offset)
				if (y <= x) {
					n -= j
					i = 0
					offset += j
					break loop
				}
			}

			if (r === n) {
				break
			}

			i = i + 1
		}
	}

	let lines = []

	let j = count

	while (j > 0) {
		lines.unshift(words.slice(breaks[j], j).join(" "))
		j = breaks[j]
	}

	return lines
}

let section = [...new Array(100)]
	.fill(
		"On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, they cannot foresee the pain and trouble that are bound to ensue."
	)
	.join(" ")

console.time()
console.log(linear(section, 80).map(s => `<span>${s}</span>`).join(''))
console.timeEnd()
