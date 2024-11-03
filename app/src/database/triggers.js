const createTriggers = (db) => {
    const triggers = [
        // código slite para criar as triggers
    ];

    triggers.forEach(trigger => {
        db.run(trigger, (err) => {
            if (err) {
                console.error('Erro ao criar trigger:', err);
            }
        });
    });
};

module.exports = { createTriggers };