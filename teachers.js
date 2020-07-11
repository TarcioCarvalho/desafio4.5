const fs = require("fs")
const data = require("./data.json")
const { age, graduation, date } = require("./utils")

//show
exports.show = function (req, res) {
    const { id } = req.params

    const foundTeacher = data.teachers.find(function (teacher) {
        return teacher.id == id
    })

    if (!foundTeacher) return res.send("Teacher not found!")

    const teacher = {
        ...foundTeacher,
        age: age(foundTeacher.birth),
        degree: graduation(foundTeacher.degree),
        subjects: foundTeacher.subjects.split(","),
        created_at: Intl.DateTimeFormat("pt-br").format(foundTeacher.created_at)
    }

    return res.render("teachers/show", { teacher })
}

//create
exports.post = function (req, res) {
    
    const keys = Object.keys(req.body)

    for (let key of keys) {
        if (req.body[key] == "") {
            return res.send("Todos os campos devem ser preenchidos!")
        }
    }

    let { avatar_url, name, birth, degree, class_type, subjects } = req.body

    birth = Date.parse(birth)
    const created_at = Date.now()
    const id = Number(data.teachers.length + 1)

    data.teachers.push({
        id,
        avatar_url,
        name,
        birth,
        degree,
        class_type,
        subjects,
        created_at
    })

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function (error) {
        if (error) return res.send("Erro no banco de dados!")
        
        return res.redirect("/teachers")
    })

}

//edit
exports.edit = function (req, res) {
    const { id } = req.params
    const foundTeacher = data.teachers.find(function (teacher) {
        return teacher.id == id
    })

    if (!foundTeacher) return res.send("Teacher not found!")

    const teacher = {
        ...foundTeacher,
        birth: date(foundTeacher.birth),
    }

    return res.render("teachers/edit", { teacher })
}

//put
exports.put = function (req, res) {
    const { id } = req.body
    let index = 0

    const foundTeacher = data.teachers.find(function (teacher, foundIndex) {
        if (teacher.id == id) {
            index = foundIndex
            return true
        }
    })

    if (!foundTeacher) return res.send("Teacher not found!")

    const teacher = {
        ...foundTeacher,
        ...req.body,
        birth: Date.parse(req.body.birth),
    }

    data.teachers[index] = teacher

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function (error) {
        if (error) return res.send("Write file error!")
        
        return res.redirect(`/teachers/${id}`)
    })

}

//delete
exports.delete = function (req, res) {
    const { id } = req.body

    const filteredTeacher = data.teachers.filter(function (teacher) {
        return teacher.id != id
    })

    data.teachers = filteredTeacher

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function (error) {
        if (error) return res.send("Write file error!")
        
        return res.redirect("/teachers")
    })
}